/**
 * Utility functions for handling dates to avoid timezone issues
 * Based on the working pattern from inventory module
 */

/**
 * Gets current date in YYYY-MM-DD format for input fields
 * (Same pattern used in inventory module that works correctly)
 * @returns Current date string in YYYY-MM-DD format
 */
export const getCurrentDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Formats date for input fields (YYYY-MM-DD format)
 * (Same pattern used in inventory module that works correctly)
 * @param dateInput - Date string or Date object
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return '';
  
  if (typeof dateInput === 'string') {
    // If it's already in YYYY-MM-DD format, return as is
    if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateInput;
    }
    // If it has time component, extract date part
    if (dateInput.includes('T')) {
      return dateInput.split('T')[0];
    }
  }
  
  // If it's a Date object, convert to YYYY-MM-DD
  return new Date(dateInput).toISOString().split('T')[0];
};

/**
 * Formats a date for display avoiding timezone issues
 * Handles both YYYY-MM-DD and ISO format strings
 * @param dateInput - Date string in YYYY-MM-DD or ISO format, or Date object from backend
 * @param locale - Locale for formatting (default: 'es-ES')
 * @returns Formatted date string for display
 */
export const formatDateLocal = (
  dateInput: string | Date | null | undefined,
  locale = 'es-ES'
): string => {
  if (!dateInput) return 'N/A';

  let date: Date;
  
  if (typeof dateInput === 'string') {
    // Handle both YYYY-MM-DD and ISO formats
    let dateStr = dateInput;
    
    // If it's an ISO string, extract just the date part
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    
    // Parse as local date to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    date = new Date(year, month - 1, day); // month is 0-indexed
  } else {
    // For Date objects, use directly
    date = dateInput;
  }
  
  if (isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date with custom options
 * @param dateInput - Date string in YYYY-MM-DD format or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale for formatting (default: 'es-ES')
 * @returns Formatted date string
 */
export const formatDateLocalWithOptions = (
  dateInput: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions,
  locale = 'es-ES'
): string => {
  if (!dateInput) return 'N/A';

  const date = new Date(dateInput);
  
  if (isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString(locale, options);
};

/**
 * Converts date input to Date object for backend submission
 * (Same pattern used in inventory module)
 * @param dateInput - Date string in YYYY-MM-DD format
 * @returns Date object for backend
 */
export const parseLocalDate = (dateInput: string | Date | null | undefined): Date | null => {
  if (!dateInput) return null;

  try {
    // Use the same pattern as inventory: new Date(dateString)
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};