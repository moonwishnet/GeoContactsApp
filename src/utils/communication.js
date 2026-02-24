import { Linking, Platform } from 'react-native';

// 打电话功能
export const makePhoneCall = async (phoneNumber) => {
  try {
    const url = `tel:${phoneNumber}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    } else {
      throw new Error('无法拨打电话');
    }
  } catch (error) {
    console.error('拨打电话失败:', error);
    return false;
  }
};

// 发送短信
export const sendSMS = async (phoneNumber, message = '') => {
  try {
    const url = Platform.select({
      ios: `sms:${phoneNumber}${message ? `&body=${encodeURIComponent(message)}` : ''}`,
      android: `sms:${phoneNumber}${message ? `?body=${encodeURIComponent(message)}` : ''}`,
    });
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    return false;
  } catch (error) {
    console.error('发送短信失败:', error);
    return false;
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
        url = `baidumap://map/direction?origin=latlng:${latitude},${longitude}|name:我的位置&destination=latlng:${latitude},${longitude}|name:${encodeURIComponent(name)}&mode=driving&coord_type=gcj02`;
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
      return true;
    } else {
      // 如果指定的导航应用未安装，尝试使用系统默认
      const fallbackUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;
      const canOpenFallback = await Linking.canOpenURL(fallbackUrl);
      if (canOpenFallback) {
        await Linking.openURL(fallbackUrl);
        return true;
      }
      throw new Error('未安装导航应用');
    }
  } catch (error) {
    console.error('导航失败:', error);
    return false;
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
      installed.push(app);
    } else {
      const isInstalled = await checkNavigationApp(app.id);
      if (isInstalled) {
        installed.push(app);
      }
    }
  }
  
  return installed;
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
    return true;
  } catch (error) {
    console.error('分享位置失败:', error);
    return false;
  }
};

// 触发SOS紧急呼叫
export const triggerSOS = async (contacts) => {
  try {
    // 发送位置给紧急联系人
    for (const contact of contacts) {
      if (contact.phone && contact.phone !== '110') {
        await sendSMS(contact.phone, '【紧急求助】我遇到了紧急情况，请尽快联系我！我的位置：' + 
          '(需要获取当前位置)');
      }
    }
    
    // 拨打第一个紧急联系人
    if (contacts.length > 0 && contacts[0].phone) {
      await makePhoneCall(contacts[0].phone);
    }
    
    return true;
  } catch (error) {
    console.error('SOS触发失败:', error);
    return false;
  }
};
