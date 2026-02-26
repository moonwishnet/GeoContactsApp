import { Linking, Platform, Alert } from 'react-native';
import * as SMS from 'expo-sms';

// 打电话功能
export const makePhoneCall = async (phoneNumber) => {
  try {
    const url = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return { success: true };
    } else {
      return { success: false, error: '无法拨打电话，请检查设备是否支持' };
    }
  } catch (error) {
    console.error('拨打电话失败:', error);
    return { success: false, error: error.message };
  }
};

// 发送短信
export const sendSMSMessage = async (phoneNumber, message = '') => {
  try {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const result = await SMS.sendSMSAsync([phoneNumber], message);
      return { success: true, result };
    } else {
      // 使用 Linking 作为备选
      const url = Platform.select({
        ios: `sms:${phoneNumber}${message ? `&body=${encodeURIComponent(message)}` : ''}`,
        android: `sms:${phoneNumber}${message ? `?body=${encodeURIComponent(message)}` : ''}`,
      });
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return { success: true };
      }
      return { success: false, error: '短信功能不可用' };
    }
  } catch (error) {
    console.error('发送短信失败:', error);
    return { success: false, error: error.message };
  }
};

// 批量发送短信
export const sendBulkSMS = async (phoneNumbers, message) => {
  try {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const result = await SMS.sendSMSAsync(phoneNumbers, message);
      return { success: true, result };
    } else {
      // 逐个发送
      for (const phone of phoneNumbers) {
        await sendSMSMessage(phone, message);
      }
      return { success: true };
    }
  } catch (error) {
    console.error('批量发送短信失败:', error);
    return { success: false, error: error.message };
  }
};

// 导航到指定位置
export const navigateToLocation = async (latitude, longitude, name, navApp = 'amap') => {
  try {
    let url = '';
    
    switch (navApp) {
      case 'amap':
        // 高德地图
        url = `amapuri://route/plan/?sid=&did=&dlat=${latitude}&dlon=${longitude}&dname=${encodeURIComponent(name)}&dev=0&t=0`;
        break;
        
      case 'baidu':
        // 百度地图
        url = `baidumap://map/direction?destination=latlng:${latitude},${longitude}|name:${encodeURIComponent(name)}&mode=driving&coord_type=gcj02`;
        break;
        
      case 'tencent':
        // 腾讯地图
        url = `qqmap://map/routeplan?type=drive&from=我的位置&fromcoord=CurrentLocation&to=${encodeURIComponent(name)}&tocoord=${latitude},${longitude}&coord_type=1`;
        break;
        
      case 'google':
        // Google地图
        url = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
        break;
        
      case 'system':
      default:
        // 系统默认地图
        url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
        break;
    }
    
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return { success: true };
    } else {
      // 如果指定的导航应用未安装，尝试使用系统默认
      const fallbackUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
      const canOpenFallback = await Linking.canOpenURL(fallbackUrl);
      if (canOpenFallback) {
        await Linking.openURL(fallbackUrl);
        return { success: true, fallback: true };
      }
      return { success: false, error: '未安装导航应用' };
    }
  } catch (error) {
    console.error('导航失败:', error);
    return { success: false, error: error.message };
  }
};

// 检查导航应用是否安装
export const checkNavigationApp = async (navApp) => {
  try {
    let url = '';
    switch (navApp) {
      case 'amap':
        url = 'amapuri://';
        break;
      case 'baidu':
        url = 'baidumap://';
        break;
      case 'tencent':
        url = 'qqmap://';
        break;
      case 'google':
        url = 'comgooglemaps://';
        break;
      default:
        return false;
    }
    return await Linking.canOpenURL(url);
  } catch (error) {
    return false;
  }
};

// 获取已安装的导航应用列表
export const getInstalledNavigationApps = async () => {
  const apps = [
    { id: 'amap', name: '高德地图', icon: 'map-marker-alt' },
    { id: 'baidu', name: '百度地图', icon: 'map-marker-alt' },
    { id: 'tencent', name: '腾讯地图', icon: 'map-marker-alt' },
    { id: 'google', name: 'Google地图', icon: 'map-marker-alt' },
    { id: 'system', name: '系统默认', icon: 'map' },
  ];
  
  const installed = [];
  for (const app of apps) {
    if (app.id === 'system') {
      installed.push({ ...app, installed: true });
    } else {
      const isInstalled = await checkNavigationApp(app.id);
      installed.push({ ...app, installed: isInstalled });
    }
  }
  
  return installed;
};

// 打开网页版地图（作为备选）
export const openWebMap = async (latitude, longitude, name) => {
  try {
    const url = `https://uri.amap.com/navigation?to=${longitude},${latitude},${encodeURIComponent(name)}&mode=car&policy=1`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return { success: true };
    }
    return { success: false, error: '无法打开网页地图' };
  } catch (error) {
    console.error('打开网页地图失败:', error);
    return { success: false, error: error.message };
  }
};

// 分享位置
export const shareLocation = async (latitude, longitude, name) => {
  try {
    const message = `我在 ${name}，位置：${latitude},${longitude}`;
    const url = Platform.select({
      ios: `sms:&body=${encodeURIComponent(message)}`,
      android: `sms:?body=${encodeURIComponent(message)}`,
    });
    await Linking.openURL(url);
    return { success: true };
  } catch (error) {
    console.error('分享位置失败:', error);
    return { success: false, error: error.message };
  }
};

// 触发SOS紧急呼叫
export const triggerSOS = async (contacts, currentLocation = null) => {
  try {
    const locationStr = currentLocation 
      ? `我的位置：${currentLocation.address || `${currentLocation.latitude},${currentLocation.longitude}`}`
      : '位置信息获取中...';
    
    const message = `【紧急求助】我遇到了紧急情况，请尽快联系我！${locationStr}`;
    
    // 发送位置给紧急联系人
    const phoneNumbers = contacts
      .filter(c => c.phone && c.phone !== '110')
      .map(c => c.phone);
    
    if (phoneNumbers.length > 0) {
      await sendBulkSMS(phoneNumbers, message);
    }
    
    // 拨打第一个紧急联系人
    if (contacts.length > 0 && contacts[0].phone) {
      setTimeout(() => {
        makePhoneCall(contacts[0].phone);
      }, 1000);
    }
    
    return { success: true };
  } catch (error) {
    console.error('SOS触发失败:', error);
    return { success: false, error: error.message };
  }
};

// 发送SOS位置更新
export const sendSOSLocationUpdate = async (contacts, location) => {
  try {
    const locationStr = location 
      ? `当前位置：${location.address || `${location.latitude},${location.longitude}`}`
      : '位置信息获取失败';
    
    const message = `【位置更新】${locationStr} - 时间：${new Date().toLocaleString()}`;
    
    const phoneNumbers = contacts
      .filter(c => c.phone && c.phone !== '110')
      .map(c => c.phone);
    
    if (phoneNumbers.length > 0) {
      await sendBulkSMS(phoneNumbers, message);
    }
    
    return { success: true };
  } catch (error) {
    console.error('发送位置更新失败:', error);
    return { success: false, error: error.message };
  }
};

// 打开应用设置
export const openAppSettings = async () => {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
    return { success: true };
  } catch (error) {
    console.error('打开设置失败:', error);
    return { success: false, error: error.message };
  }
};

// 打开隐私政策网页
export const openPrivacyPolicy = async () => {
  try {
    const url = 'https://geocontacts.pro/privacy-policy';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return { success: true };
    }
    return { success: false, error: '无法打开隐私政策页面' };
  } catch (error) {
    console.error('打开隐私政策失败:', error);
    return { success: false, error: error.message };
  }
};

// 打开用户协议网页
export const openUserAgreement = async () => {
  try {
    const url = 'https://geocontacts.pro/user-agreement';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return { success: true };
    }
    return { success: false, error: '无法打开用户协议页面' };
  } catch (error) {
    console.error('打开用户协议失败:', error);
    return { success: false, error: error.message };
  }
};
