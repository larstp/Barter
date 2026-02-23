/**
 * Formats a date string to a localized date format
 * @param {string} dateString - The date string to format (format should be ISO)
 * @returns {string} The formatted date string ("2/23/2026")
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Formats a date string to a localized date and time format
 * @param {string} dateString - The date string to format (format should be ISO)
 * @returns {string} The formatted date and time string (e.g., "2/23/2026, 3:45:00 PM")
 */
export function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

/**
 * Calculates the remaining time until an auction ends
 * @param {string} endsAt - The end date/time of the auction (ISO format)
 * @returns {string} A formatted string showing time remaining (just changed this)
 * - Over 24 hours: "5d 3h"
 * - Less than 24 hours: "23h 45m"
 * - Less than 1 hour: "45m 30s"
 * - Ended: "Auction ended"
 */
export function calculateTimeRemaining(endsAt) {
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end - now;

  if (diff <= 0) {
    return 'Auction ended';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000); // math is... not my strong suit

  // --------------------------------------------------------Over 24 hours: show days + hours
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  //----------------------------------------------------- Less than 24 hours but more than 1 hour: show hours + minutes
  else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  // ---------------------------------------------------------------------Less than 1 hour: show minutes + seconds
  else {
    return `${minutes}m ${seconds}s`;
  }
}

/**
 * Creates a live countdown timer that updates automatically
 * Updates every second when < 1 hour remaining, otherwise every minute
 * @param {string} endsAt - The end date/time of the auction (ISO format)
 * @param {Function} callback - Function to call with the updated time string on each interval
 * @returns {number} The interval ID that can be used with clearInterval() to stop the countdown
 * @example
 * const intervalId = startCountdown('2026-12-31T23:59:59Z', (timeString) => {
 *   element.textContent = timeString;
 * });
 * // Later: clearInterval(intervalId);
 */
export function startCountdown(endsAt, callback) {
  let intervalId;

  // Call immediately! to avoid delay
  callback(calculateTimeRemaining(endsAt));

  function updateCountdown() {
    const now = new Date();
    const end = new Date(endsAt);
    const diff = end - now;
    const timeString = calculateTimeRemaining(endsAt);

    callback(timeString);

    // Stop the interval if auction ends
    if (timeString === 'Auction ended') {
      clearInterval(intervalId);
      return;
    }

    // ---------------------------------------If we just crossed the 1-hour threshold, restart with 1-second interval
    const oneHour = 60 * 60 * 1000;
    if (diff < oneHour && diff > oneHour - 60000) {
      clearInterval(intervalId);
      intervalId = setInterval(updateCountdown, 1000);
    }
  }

  //----------------------------------------------- Determine initial interval: 1 second if < 1 hour, 1 minute otherwise
  // i feel like im doing something wrong with the intervals but it seems to work.
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end - now;
  const updateInterval = diff < 60 * 60 * 1000 ? 1000 : 60000;

  intervalId = setInterval(updateCountdown, updateInterval);

  return intervalId;
}

/**
 * Validates if a string is a valid email format
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email format is valid, false otherwise
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if an email is a Noroff student email
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email ends with '@stud.noroff.no', false otherwise
 */
export function isValidNoroffEmail(email) {
  return email.endsWith('@stud.noroff.no');
}

/**
 * Truncates text to a maximum length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length of the text
 * @returns {string} The truncated text with '...' appended if it was cut, or the original text if it fits
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
