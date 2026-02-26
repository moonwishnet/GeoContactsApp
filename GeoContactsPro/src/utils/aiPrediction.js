// GeoAI 基础预测功能 - 简化规则版
// 基于联系频率、时间规律、位置距离进行预测

import { calculateDistance } from './time';

/**
 * 沟通预测
 * 基于用户与联系人的历史通话、消息频率（近30天）、时间规律
 * 预测未来24小时内可能需要沟通的联系人
 * @param {Array} contacts - 联系人列表
 * @param {Object} currentLocation - 当前位置 {latitude, longitude}
 * @returns {Array} - 预测结果，最多3个
 */
export const predictCommunication = (contacts, currentLocation = null) => {
  if (!contacts || contacts.length === 0) return [];
  
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const twentyFourHoursLater = now + 24 * 60 * 60 * 1000;
  
  // 计算每个联系人的沟通概率
  const predictions = contacts.map(contact => {
    let probability = 0;
    const factors = [];
    
    // 因素1：最近联系频率（权重40%）
    if (contact.lastContact) {
      const daysSinceLastContact = (now - contact.lastContact) / (24 * 60 * 60 * 1000);
      
      if (daysSinceLastContact <= 1) {
        probability += 0.10;
        factors.push('今天刚联系过');
      } else if (daysSinceLastContact <= 3) {
        probability += 0.20;
        factors.push('3天内联系过');
      } else if (daysSinceLastContact <= 7) {
        probability += 0.30;
        factors.push('一周内联系过');
      } else if (daysSinceLastContact <= 14) {
        probability += 0.25;
        factors.push('两周内联系过');
      } else if (daysSinceLastContact <= 30) {
        probability += 0.15;
        factors.push('一月内联系过');
      } else {
        probability += 0.05;
        factors.push('很久未联系');
      }
    } else {
      probability += 0.05;
      factors.push('从未联系');
    }
    
    // 因素2：关系等级（权重20%）
    const relationshipWeight = contact.relationship / 5;
    probability += relationshipWeight * 0.20;
    if (contact.relationship >= 4) {
      factors.push('亲密关系');
    }
    
    // 因素3：收藏状态（权重10%）
    if (contact.isFavorite) {
      probability += 0.10;
      factors.push('收藏联系人');
    }
    
    // 因素4：距离因素（权重20%）
    if (currentLocation && contact.latitude && contact.longitude) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        contact.latitude,
        contact.longitude
      );
      
      if (distance <= 1) {
        probability += 0.20;
        factors.push('距离很近');
      } else if (distance <= 5) {
        probability += 0.15;
        factors.push('距离较近');
      } else if (distance <= 10) {
        probability += 0.10;
        factors.push('距离适中');
      } else {
        probability += 0.05;
        factors.push('距离较远');
      }
    }
    
    // 因素5：在线状态（权重10%）
    if (contact.status === 'online') {
      probability += 0.10;
      factors.push('当前在线');
    } else if (contact.status === 'busy') {
      probability += 0.05;
      factors.push('当前忙碌');
    }
    
    // 归一化概率到0-1
    probability = Math.min(1, Math.max(0, probability));
    
    // 生成建议时间
    const suggestedTime = generateSuggestedTime(contact);
    
    return {
      contact,
      probability,
      factors,
      suggestedTime,
      type: '沟通预测',
    };
  });
  
  // 按概率排序，返回前3个
  return predictions
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3)
    .filter(p => p.probability > 0.3); // 只返回概率大于30%的
};

/**
 * 相遇预测
 * 基于用户与联系人的常用位置、实时位置
 * 预测未来24小时内可能相遇的联系人
 * @param {Array} contacts - 联系人列表
 * @param {Object} currentLocation - 当前位置 {latitude, longitude}
 * @returns {Array} - 预测结果，最多2个
 */
export const predictEncounter = (contacts, currentLocation) => {
  if (!contacts || contacts.length === 0 || !currentLocation) return [];
  
  const predictions = [];
  
  contacts.forEach(contact => {
    // 只考虑有常用位置的联系人
    if (!contact.commonLocations || contact.commonLocations.length === 0) return;
    
    contact.commonLocations.forEach(loc => {
      // 计算当前位置到联系人常用位置的距离
      const distanceToCommonLocation = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        loc.latitude,
        loc.longitude
      );
      
      // 如果在5公里范围内，有可能相遇
      if (distanceToCommonLocation <= 5) {
        let probability = 0;
        const factors = [];
        
        // 距离越近概率越高
        if (distanceToCommonLocation <= 1) {
          probability += 0.50;
          factors.push('您正在对方常用位置附近');
        } else if (distanceToCommonLocation <= 3) {
          probability += 0.35;
          factors.push('您距离对方常用位置较近');
        } else {
          probability += 0.20;
          factors.push('您和对方常用位置在同一区域');
        }
        
        // 考虑联系频率
        if (contact.lastContact) {
          const daysSinceLastContact = (Date.now() - contact.lastContact) / (24 * 60 * 60 * 1000);
          if (daysSinceLastContact <= 7) {
            probability += 0.20;
            factors.push('近期有联系');
          }
        }
        
        // 考虑关系等级
        probability += (contact.relationship / 5) * 0.15;
        
        // 考虑在线状态
        if (contact.status === 'online') {
          probability += 0.15;
          factors.push('对方当前在线');
        }
        
        // 归一化
        probability = Math.min(1, Math.max(0, probability));
        
        // 生成相遇时间和地点
        const encounterTime = generateEncounterTime();
        const encounterLocation = loc;
        
        predictions.push({
          contact,
          probability,
          factors,
          encounterTime,
          encounterLocation,
          type: '相遇预测',
        });
      }
    });
  });
  
  // 按概率排序，返回前2个
  return predictions
    .sort((a, b) => b.probability - b.probability)
    .slice(0, 2)
    .filter(p => p.probability > 0.4); // 只返回概率大于40%的
};

/**
 * 生成建议联系时间
 */
const generateSuggestedTime = (contact) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // 根据联系人的bestTime生成建议时间
  if (contact.bestTime) {
    if (contact.bestTime.includes('18:30')) {
      // 建议今天18:30
      return {
        date: '今天',
        time: '18:30',
        fullTime: new Date(now.setHours(18, 30, 0, 0)).getTime(),
      };
    } else if (contact.bestTime.includes('12:00')) {
      return {
        date: '今天',
        time: '12:00',
        fullTime: new Date(now.setHours(12, 0, 0, 0)).getTime(),
      };
    } else if (contact.bestTime.includes('随时')) {
      // 建议1小时后
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      return {
        date: '今天',
        time: `${String(oneHourLater.getHours()).padStart(2, '0')}:${String(oneHourLater.getMinutes()).padStart(2, '0')}`,
        fullTime: oneHourLater.getTime(),
      };
    }
  }
  
  // 默认建议时间
  if (currentHour < 12) {
    return {
      date: '今天',
      time: '14:00',
      fullTime: new Date(now.setHours(14, 0, 0, 0)).getTime(),
    };
  } else if (currentHour < 18) {
    return {
      date: '今天',
      time: '19:00',
      fullTime: new Date(now.setHours(19, 0, 0, 0)).getTime(),
    };
  } else {
    // 明天上午
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return {
      date: '明天',
      time: '10:00',
      fullTime: tomorrow.getTime(),
    };
  }
};

/**
 * 生成相遇时间
 */
const generateEncounterTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // 根据当前时间生成合理的相遇时间
  if (currentHour >= 8 && currentHour < 12) {
    // 上午，建议午餐时间
    return {
      date: '今天',
      time: '12:00-13:00',
      description: '午餐时间',
      fullTime: new Date(now.setHours(12, 0, 0, 0)).getTime(),
    };
  } else if (currentHour >= 12 && currentHour < 18) {
    // 下午，建议傍晚
    return {
      date: '今天',
      time: '18:00-19:00',
      description: '下班时间',
      fullTime: new Date(now.setHours(18, 0, 0, 0)).getTime(),
    };
  } else if (currentHour >= 18 && currentHour < 22) {
    // 晚上
    return {
      date: '今晚',
      time: '20:00-21:00',
      description: '晚间时段',
      fullTime: new Date(now.setHours(20, 0, 0, 0)).getTime(),
    };
  } else {
    // 深夜或凌晨，建议明天
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return {
      date: '明天',
      time: '09:00-10:00',
      description: '上午时段',
      fullTime: tomorrow.getTime(),
    };
  }
};

/**
 * 生成热力图数据
 * 基于联系历史分析活跃时段
 * @param {Array} contacts - 联系人列表
 * @returns {Array} - 24小时活跃度数据
 */
export const generateHeatmapData = (contacts) => {
  const hours = [];
  
  for (let i = 0; i < 24; i++) {
    // 基础活跃度
    let baseActivity = 0.2;
    
    // 工作时间活跃度较高
    if (i >= 9 && i <= 18) baseActivity = 0.7;
    // 午餐时间最活跃
    if (i >= 12 && i <= 13) baseActivity = 0.9;
    // 晚上也较活跃
    if (i >= 19 && i <= 22) baseActivity = 0.8;
    // 深夜活跃度低
    if (i >= 0 && i <= 6) baseActivity = 0.1;
    
    // 根据联系人数据调整
    let contactFactor = 0;
    if (contacts && contacts.length > 0) {
      contacts.forEach(contact => {
        if (contact.lastContact) {
          const lastContactHour = new Date(contact.lastContact).getHours();
          if (Math.abs(lastContactHour - i) <= 2) {
            contactFactor += 0.1;
          }
        }
      });
    }
    
    // 添加随机波动
    const randomFactor = (Math.random() - 0.5) * 0.2;
    
    const activity = Math.min(1, Math.max(0, baseActivity + contactFactor + randomFactor));
    
    hours.push({
      hour: i,
      activity: activity,
      label: `${String(i).padStart(2, '0')}:00`,
    });
  }
  
  return hours;
};

/**
 * 分析联系规律
 * @param {Array} contacts - 联系人列表
 * @returns {Object} - 分析结果
 */
export const analyzeContactPatterns = (contacts) => {
  if (!contacts || contacts.length === 0) {
    return {
      mostActiveTime: '未知',
      mostActiveDay: '未知',
      averageContactInterval: '未知',
      totalContacts: 0,
    };
  }
  
  // 统计联系时间分布
  const hourDistribution = new Array(24).fill(0);
  const dayDistribution = new Array(7).fill(0);
  let totalInterval = 0;
  let intervalCount = 0;
  
  contacts.forEach(contact => {
    if (contact.lastContact) {
      const date = new Date(contact.lastContact);
      hourDistribution[date.getHours()]++;
      dayDistribution[date.getDay()]++;
      
      const daysSince = (Date.now() - contact.lastContact) / (24 * 60 * 60 * 1000);
      totalInterval += daysSince;
      intervalCount++;
    }
  });
  
  // 找出最活跃的时间段
  const mostActiveHour = hourDistribution.indexOf(Math.max(...hourDistribution));
  const mostActiveDay = dayDistribution.indexOf(Math.max(...dayDistribution));
  
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  
  return {
    mostActiveTime: `${String(mostActiveHour).padStart(2, '0')}:00-${String(mostActiveHour + 1).padStart(2, '0')}:00`,
    mostActiveDay: weekdays[mostActiveDay],
    averageContactInterval: intervalCount > 0 ? `${Math.round(totalInterval / intervalCount)}天` : '从未联系',
    totalContacts: contacts.length,
  };
};

/**
 * 智能提醒生成
 * 基于预测结果生成提醒内容
 * @param {Array} predictions - 预测结果
 * @returns {Array} - 提醒列表
 */
export const generateSmartReminders = (predictions) => {
  if (!predictions || predictions.length === 0) return [];
  
  return predictions.map((pred, index) => {
    const contact = pred.contact;
    const probability = Math.round(pred.probability * 100);
    
    let title = '';
    let message = '';
    let action = '';
    
    if (pred.type === '沟通预测') {
      title = `建议联系 ${contact.name}`;
      message = `${probability}% 概率需要沟通 · 建议时间：${pred.suggestedTime.date} ${pred.suggestedTime.time}`;
      action = '立即联系';
    } else if (pred.type === '相遇预测') {
      title = `可能遇见 ${contact.name}`;
      message = `${probability}% 概率相遇 · ${pred.encounterTime.description} · ${pred.encounterLocation.name}`;
      action = '查看路线';
    }
    
    return {
      id: `reminder-${index}`,
      title,
      message,
      action,
      contact,
      prediction: pred,
      priority: pred.probability > 0.7 ? 'high' : pred.probability > 0.5 ? 'medium' : 'low',
    };
  });
};
