import * as Contacts from 'expo-contacts';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';

// 加密密钥
const ENCRYPTION_KEY = 'geocontacts-pro-export-key-2024';

/**
 * 简单的XOR加密
 */
const encryptData = (data) => {
  const jsonString = JSON.stringify(data);
  let encrypted = '';
  for (let i = 0; i < jsonString.length; i++) {
    encrypted += String.fromCharCode(
      jsonString.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  return btoa(encrypted);
};

/**
 * 简单的XOR解密
 */
const decryptData = (encryptedData) => {
  try {
    const decoded = atob(encryptedData);
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      decrypted += String.fromCharCode(
        decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
};

/**
 * 请求联系人权限
 */
export const requestContactsPermission = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    return { granted: status === 'granted', status };
  } catch (error) {
    console.error('请求联系人权限失败:', error);
    return { granted: false, error: error.message };
  }
};

/**
 * 从手机通讯录导入联系人
 * @param {boolean} importAll - 是否导入所有联系人
 * @returns {Object} - 导入结果
 */
export const importFromPhoneContacts = async (importAll = false) => {
  try {
    // 检查权限
    const { granted } = await requestContactsPermission();
    if (!granted) {
      return { success: false, error: '未获得联系人权限' };
    }
    
    // 获取联系人
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Emails,
        Contacts.Fields.Addresses,
        Contacts.Fields.Company,
        Contacts.Fields.JobTitle,
        Contacts.Fields.Image,
      ],
    });
    
    if (!data || data.length === 0) {
      return { success: false, error: '未找到联系人' };
    }
    
    // 转换联系人格式
    const importedContacts = data
      .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
      .map(contact => ({
        id: `imported-${contact.id}`,
        name: contact.name || '未知',
        phone: contact.phoneNumbers[0]?.number || '',
        avatar: contact.image?.uri || null,
        email: contact.emails?.[0]?.email || '',
        company: contact.company || '',
        position: contact.jobTitle || '',
        address: contact.addresses?.[0]?.street || '',
        distance: Math.random() * 10,
        distanceUnit: 'km',
        relationship: 3,
        status: 'offline',
        location: contact.addresses?.[0]?.street || '未知位置',
        latitude: contact.addresses?.[0]?.latitude || 39.9042 + (Math.random() - 0.5) * 0.1,
        longitude: contact.addresses?.[0]?.longitude || 116.4074 + (Math.random() - 0.5) * 0.1,
        isFavorite: false,
        context: '从手机通讯录导入',
        bestTime: '随时',
        lastContact: null,
        categories: [],
        tags: contact.company ? [contact.company] : [],
        commonLocations: [],
        importedFrom: 'phone',
        importedAt: Date.now(),
      }));
    
    return {
      success: true,
      contacts: importedContacts,
      totalFound: data.length,
      totalImported: importedContacts.length,
    };
  } catch (error) {
    console.error('导入联系人失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 导出联系人到加密文件
 * @param {Array} contacts - 要导出的联系人
 * @param {boolean} encrypted - 是否加密
 * @returns {Object} - 导出结果
 */
export const exportContactsToFile = async (contacts, encrypted = true) => {
  try {
    // 准备导出数据
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      app: 'GeoContacts+ Pro',
      contactCount: contacts.length,
      contacts: contacts,
    };
    
    // 加密或明文
    const fileContent = encrypted 
      ? encryptData(exportData)
      : JSON.stringify(exportData, null, 2);
    
    // 生成文件名
    const timestamp = new Date().getTime();
    const fileName = `geocontacts_backup_${timestamp}${encrypted ? '.enc' : '.json'}`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    // 写入文件
    await FileSystem.writeAsStringAsync(filePath, fileContent);
    
    // 分享文件
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: encrypted ? 'application/octet-stream' : 'application/json',
        dialogTitle: '导出联系人备份',
        UTI: encrypted ? 'public.data' : 'public.json',
      });
    }
    
    return {
      success: true,
      filePath,
      fileName,
      contactCount: contacts.length,
      encrypted,
    };
  } catch (error) {
    console.error('导出联系人失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 从文件导入联系人
 * @returns {Object} - 导入结果
 */
export const importContactsFromFile = async () => {
  try {
    // 选择文件
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'application/octet-stream', '*/*'],
      copyToCacheDirectory: true,
    });
    
    if (result.canceled) {
      return { success: false, error: '用户取消' };
    }
    
    const file = result.assets[0];
    const fileContent = await FileSystem.readAsStringAsync(file.uri);
    
    // 尝试解密
    let importData;
    try {
      importData = decryptData(fileContent);
    } catch (e) {
      // 解密失败，尝试直接解析JSON
      try {
        importData = JSON.parse(fileContent);
      } catch (e2) {
        return { success: false, error: '无法解析文件格式' };
      }
    }
    
    // 验证数据格式
    if (!importData || !importData.contacts || !Array.isArray(importData.contacts)) {
      return { success: false, error: '无效的数据格式' };
    }
    
    // 转换联系人格式
    const importedContacts = importData.contacts.map(contact => ({
      ...contact,
      id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      importedAt: Date.now(),
      importedFrom: 'file',
    }));
    
    return {
      success: true,
      contacts: importedContacts,
      totalImported: importedContacts.length,
      exportDate: importData.exportDate,
      exportVersion: importData.version,
    };
  } catch (error) {
    console.error('从文件导入失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 生成CSV格式的联系人导出
 * @param {Array} contacts - 联系人列表
 * @returns {Object} - 导出结果
 */
export const exportContactsToCSV = async (contacts) => {
  try {
    // CSV 表头
    const headers = ['姓名', '电话', '邮箱', '公司', '职位', '地址', '标签'];
    
    // CSV 内容
    const rows = contacts.map(contact => [
      contact.name || '',
      contact.phone || '',
      contact.email || '',
      contact.company || '',
      contact.position || '',
      contact.address || contact.location || '',
      (contact.tags || []).join(';'),
    ]);
    
    // 生成CSV内容
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    
    // 添加BOM以支持中文
    const BOM = '\uFEFF';
    const fileContent = BOM + csvContent;
    
    // 生成文件名
    const timestamp = new Date().getTime();
    const fileName = `geocontacts_export_${timestamp}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    
    // 写入文件
    await FileSystem.writeAsStringAsync(filePath, fileContent);
    
    // 分享文件
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: '导出联系人CSV',
        UTI: 'public.comma-separated-values-text',
      });
    }
    
    return {
      success: true,
      filePath,
      fileName,
      contactCount: contacts.length,
    };
  } catch (error) {
    console.error('导出CSV失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 从CSV导入联系人
 * @returns {Object} - 导入结果
 */
export const importContactsFromCSV = async () => {
  try {
    // 选择文件
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/csv',
      copyToCacheDirectory: true,
    });
    
    if (result.canceled) {
      return { success: false, error: '用户取消' };
    }
    
    const file = result.assets[0];
    const fileContent = await FileSystem.readAsStringAsync(file.uri);
    
    // 解析CSV
    const lines = fileContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return { success: false, error: 'CSV文件格式无效' };
    }
    
    // 解析表头
    const headers = parseCSVLine(lines[0]);
    
    // 解析数据行
    const importedContacts = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const contact = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header.trim()) {
          case '姓名':
            contact.name = value;
            break;
          case '电话':
            contact.phone = value;
            break;
          case '邮箱':
            contact.email = value;
            break;
          case '公司':
            contact.company = value;
            break;
          case '职位':
            contact.position = value;
            break;
          case '地址':
            contact.address = value;
            contact.location = value;
            break;
          case '标签':
            contact.tags = value.split(';').filter(t => t.trim());
            break;
        }
      });
      
      if (contact.name && contact.phone) {
        importedContacts.push({
          ...contact,
          id: `csv-${Date.now()}-${i}`,
          distance: Math.random() * 10,
          distanceUnit: 'km',
          relationship: 3,
          status: 'offline',
          latitude: 39.9042 + (Math.random() - 0.5) * 0.1,
          longitude: 116.4074 + (Math.random() - 0.5) * 0.1,
          isFavorite: false,
          context: '从CSV导入',
          bestTime: '随时',
          lastContact: null,
          categories: [],
          commonLocations: [],
          importedFrom: 'csv',
          importedAt: Date.now(),
        });
      }
    }
    
    return {
      success: true,
      contacts: importedContacts,
      totalImported: importedContacts.length,
    };
  } catch (error) {
    console.error('从CSV导入失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 解析CSV行
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

/**
 * 获取本地备份文件列表
 * @returns {Array} - 备份文件列表
 */
export const getBackupFiles = async () => {
  try {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
    const backupFiles = files
      .filter(file => file.startsWith('geocontacts_backup_'))
      .map(file => ({
        name: file,
        path: `${FileSystem.documentDirectory}${file}`,
        timestamp: parseInt(file.match(/geocontacts_backup_(\d+)/)?.[1] || 0),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return backupFiles;
  } catch (error) {
    console.error('获取备份文件失败:', error);
    return [];
  }
};

/**
 * 删除备份文件
 * @param {string} filePath - 文件路径
 */
export const deleteBackupFile = async (filePath) => {
  try {
    await FileSystem.deleteAsync(filePath);
    return { success: true };
  } catch (error) {
    console.error('删除备份文件失败:', error);
    return { success: false, error: error.message };
  }
};
