// 格式化最近联系时间
export const formatLastContact = (timestamp) => {
  if (!timestamp) return '从未联系';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  
  if (minutes < 1) return '刚刚联系';
  if (minutes < 60) return `${minutes}分钟前联系`;
  if (hours < 24) return `${hours}小时前联系`;
  if (days < 7) return `${days}天前联系`;
  if (weeks < 4) return `${weeks}周前联系`;
  
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日联系`;
};

// 格式化日期时间
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return `今天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 格式化日期
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 格式化时间
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 格式化距离
export const formatDistance = (distance, unit = 'km') => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}${unit}`;
};

// 计算两点之间的距离（使用Haversine公式）
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 生成星级评分
export const renderStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

// 获取当前时间字符串
export const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// 获取当前日期字符串
export const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 格式化持续时间
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}小时`;
  }
  return `${hours}小时${mins}分钟`;
};

// 检查是否在工作时间
export const isWorkingHours = (startTime = '09:00', endTime = '18:00') => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= startTime && currentTime <= endTime;
};

// 获取时间段的描述
export const getTimePeriodDescription = (hour) => {
  if (hour >= 5 && hour < 8) return '清晨';
  if (hour >= 8 && hour < 12) return '上午';
  if (hour >= 12 && hour < 14) return '中午';
  if (hour >= 14 && hour < 18) return '下午';
  if (hour >= 18 && hour < 22) return '晚上';
  return '深夜';
};

// 格式化相对时间（用于AI预测）
export const formatRelativeTime = (targetTime) => {
  const now = new Date();
  const target = new Date(targetTime);
  const diffMs = target - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 0) return '已过期';
  if (diffHours === 0) return '即将';
  if (diffHours < 24) return `${diffHours}小时后`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天后`;
};

// 生成时间选项（用于选择时间）
export const generateTimeOptions = (startHour = 0, endHour = 23, interval = 30) => {
  const options = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

// 解析时间字符串
export const parseTimeString = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

// 比较两个时间
export const compareTime = (time1, time2) => {
  const t1 = parseTimeString(time1);
  const t2 = parseTimeString(time2);
  
  if (t1.hours !== t2.hours) {
    return t1.hours - t2.hours;
  }
  return t1.minutes - t2.minutes;
};

// 检查时间是否在范围内
export const isTimeInRange = (time, startTime, endTime) => {
  return compareTime(time, startTime) >= 0 && compareTime(time, endTime) <= 0;
};

// 获取星期几的中文名称
export const getWeekdayName = (date) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
};

// 格式化完整日期时间
export const formatFullDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const weekday = getWeekdayName(date);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekday} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
