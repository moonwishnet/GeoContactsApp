// 数据备份与恢复工具
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

const BACKUP_DIR = FileSystem.cacheDirectory + 'backups/';

export async function collectBackupData() {
  const keys = ['defaultNavigation', 'settings', 'sosContacts', 'contacts', 'categoryDimensions'];
  const data = {};
  for (const key of keys) {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val) data[key] = JSON.parse(val);
    } catch (e) {
      console.warn('Backup: skip key', key, e);
    }
  }
  data._meta = { app: 'GeoContacts+', version: '1.0.0', exportedAt: new Date().toISOString() };
  return data;
}

export async function exportBackup(data) {
  const dir = BACKUP_DIR;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const uri = dir + 'geocontacts-backup-' + ts + '.json';
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(data, null, 2), { encoding: FileSystem.EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: '导出 GeoContacts+ 备份', UTI: 'public.json' });
  }
  return uri;
}

export async function importBackup() {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
  if (result.canceled || !result.assets || !result.assets.length) return null;
  const raw = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
  const data = JSON.parse(raw);
  if (!data._meta || data._meta.app !== 'GeoContacts+') throw new Error('无效的备份文件');
  return data;
}

export async function applyRestore(data) {
  const keys = ['defaultNavigation', 'settings', 'sosContacts', 'contacts', 'categoryDimensions'];
  for (const key of keys) {
    if (data[key] !== undefined) await AsyncStorage.setItem(key, JSON.stringify(data[key]));
  }
}

export async function autoBackup(contacts, categoryDimensions) {
  const data = await collectBackupData();
  data.contacts = contacts;
  data.categoryDimensions = categoryDimensions;
  const dir = BACKUP_DIR;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const uri = dir + 'auto-backup-' + ts + '.json';
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(data, null, 2), { encoding: FileSystem.EncodingType.UTF8 });
  try {
    const files = await FileSystem.readDirectoryAsync(dir);
    const autos = files.filter(f => f.startsWith('auto-backup-')).sort().reverse();
    for (let i = 3; i < autos.length; i++) await FileSystem.deleteAsync(dir + autos[i], { idempotent: true });
  } catch (e) {}
  return ts;
}

export async function getLastAutoBackupTime() {
  try {
    const dir = BACKUP_DIR;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const files = await FileSystem.readDirectoryAsync(dir);
    const autos = files.filter(f => f.startsWith('auto-backup-')).sort().reverse();
    if (!autos.length) return null;
    return autos[0].replace('auto-backup-', '').replace('.json', '').replace(/-/g, (m, i) => {
      if (i === 4 || i === 7) return '-';
      if (i === 10) return 'T';
      if (i === 13 || i === 16) return ':';
      return m;
    });
  } catch (e) { return null; }
}
