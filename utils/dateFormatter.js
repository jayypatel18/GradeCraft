/**
 * Formats a date in IST (Indian Standard Time)
 * @param {Date|string} date - Date object or date string to format
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string in IST
 */
export function formatDateToIST(date, includeTime = true) {
  if (!date) return 'N/A';
  
  const options = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = true;
  }
  
  return new Date(date).toLocaleString('en-IN', options);
}