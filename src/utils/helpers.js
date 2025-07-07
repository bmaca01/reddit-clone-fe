export const getInitials = (name) => {
  return 'AA'
  //return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const formatRelativeTime = (createdAt) => {
  // Handle various input formats
  const createdDate = new Date(createdAt);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(createdDate.getTime())) {
    return 'Unknown time';
  }
  
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - createdDate.getTime();
  
  // Handle future dates (shouldn't happen but good to check)
  if (diffMs < 0) {
    return 'Just now';
  }
  
  // Convert to different time units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  // Return appropriate format based on time elapsed
  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
};