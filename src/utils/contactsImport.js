import * as Contacts from 'expo-contacts';
import { Platform, Alert } from 'react-native';

/**
 * 请求通讯录权限
 */
export async function requestContactsPermission() {
  if (Platform.OS === 'web') {
    Alert.alert('提示', 'Web 平台不支持导入通讯录功能');
    return false;
  }

  const { status } = await Contacts.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * 从手机通讯录导入联系人
 * @param {Array} existingContacts - 现有联系人列表，用于去重
 * @returns {Promise<Array>} 导入的联系人列表
 */
export async function importContactsFromPhone(existingContacts = []) {
  try {
    // 检查权限
    const hasPermission = await requestContactsPermission();
    if (!hasPermission) {
      Alert.alert('权限 denied', '需要通讯录权限才能导入联系人');
      return [];
    }

    // 获取通讯录联系人
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

    if (data.length === 0) {
      Alert.alert('提示', '通讯录为空');
      return [];
    }

    // 转换为应用联系人格式
    const importedContacts = [];
    const existingPhones = new Set(
      existingContacts.map(c => c.phone.replace(/\s/g, ''))
    );

    for (const contact of data) {
      // 跳过没有电话号码的联系人
      if (!contact.phoneNumbers || contact.phoneNumbers.length === 0) {
        continue;
      }

      const phone = contact.phoneNumbers[0].number.replace(/\s/g, '');

      // 跳过已存在的联系人（根据电话号码去重）
      if (existingPhones.has(phone)) {
        continue;
      }

      // 获取地址信息（如果有）
      let location = '未知位置';
      let latitude = null;
      let longitude = null;

      if (contact.addresses && contact.addresses.length > 0) {
        const address = contact.addresses[0];
        location = `${address.city || ''}${address.street || ''}`.trim() || '未知位置';
      }

      // 创建联系人对象
      const newContact = {
        id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: contact.name || '未知姓名',
        phone: phone,
        avatar: contact.image?.uri || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name || 'unknown'}`,
        distance: Math.random() * 10, // 随机距离，实际应用中应该根据地址计算
        distanceUnit: 'km',
        relationship: 3,
        status: 'offline',
        location: location,
        latitude: latitude,
        longitude: longitude,
        isFavorite: false,
        context: contact.company ? `${contact.company} ${contact.jobTitle || ''}`.trim() : '从通讯录导入',
        bestTime: '随时',
        lastContact: Date.now(),
        categories: [], // 导入后需要用户手动分类
        tags: contact.jobTitle ? [contact.jobTitle] : [],
      };

      importedContacts.push(newContact);
    }

    return importedContacts;
  } catch (error) {
    console.error('导入通讯录失败:', error);
    Alert.alert('错误', '导入通讯录失败: ' + error.message);
    return [];
  }
}

/**
 * 显示导入确认对话框
 * @param {number} count - 可导入的联系人数量
 * @returns {Promise<boolean>} 用户是否确认导入
 */
export function showImportConfirmDialog(count) {
  return new Promise((resolve) => {
    Alert.alert(
      '导入通讯录',
      `发现 ${count} 个新联系人，是否导入？`,
      [
        {
          text: '取消',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: '导入',
          onPress: () => resolve(true),
        },
      ]
    );
  });
}

/**
 * 批量导入联系人
 * @param {Function} addContacts - 添加联系人的回调函数
 * @param {Array} existingContacts - 现有联系人列表
 */
export async function batchImportContacts(addContacts, existingContacts = []) {
  const imported = await importContactsFromPhone(existingContacts);

  if (imported.length === 0) {
    return;
  }

  const confirmed = await showImportConfirmDialog(imported.length);

  if (confirmed) {
    addContacts(imported);
    Alert.alert('成功', `已导入 ${imported.length} 个联系人`);
  }
}
