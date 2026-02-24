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

// 格式化距离
export const formatDistance = (distance, unit = 'km') => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}${unit}`;
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
