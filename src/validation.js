/**
 * Validation Utilities
 * Enhanced input validation functions
 */

/**
 * Validate note title
 * @param {string} title - Note title
 * @returns {Object} Validation result
 */
export function validateNoteTitle(title) {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (title.length > 100) {
    errors.push('Title must not exceed 100 characters');
  }
  
  const hasSpecialChars = /[<>{}[\]\\]/.test(title);
  if (hasSpecialChars) {
    errors.push('Title contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: title.trim(),
  };
}

/**
 * Validate note body
 * @param {string} body - Note body
 * @returns {Object} Validation result
 */
export function validateNoteBody(body) {
  const errors = [];
  
  if (!body || body.trim().length === 0) {
    errors.push('Note content is required');
  } else if (body.trim().length < 10) {
    errors.push('Note content must be at least 10 characters');
  } else if (body.length > 5000) {
    errors.push('Note content must not exceed 5000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: body.trim(),
  };
}

/**
 * Validate email address
 * @param {string} email - Email address
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
  const errors = [];
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: email.trim(),
  };
}

/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {Object} Validation result
 */
export function validateSearchQuery(query) {
  const errors = [];
  
  if (query && query.length > 200) {
    errors.push('Search query is too long');
  }
  
  const hasInvalidChars = /[<>{}[\]\\]/.test(query);
  if (hasInvalidChars) {
    errors.push('Search query contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: query.trim(),
  };
}

/**
 * Validate date
 * @param {string} dateString - Date string
 * @returns {Object} Validation result
 */
export function validateDate(dateString) {
  const errors = [];
  
  if (!dateString) {
    errors.push('Date is required');
  } else {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      errors.push('Invalid date format');
    } else if (date > new Date()) {
      errors.push('Date cannot be in the future');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: dateString,
  };
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate file upload
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/json'],
  } = options;
  
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
  } else {
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
    }
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    file,
  };
}

/**
 * Validate URL
 * @param {string} url - URL string
 * @returns {Object} Validation result
 */
export function validateURL(url) {
  const errors = [];
  
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL must use HTTP or HTTPS protocol');
    }
  } catch {
    errors.push('Invalid URL format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: url,
  };
}

/**
 * Batch validate multiple fields
 * @param {Object} fields - Fields to validate
 * @param {Object} validators - Validator functions
 * @returns {Object} Validation results
 */
export function batchValidate(fields, validators) {
  const results = {};
  let hasErrors = false;
  
  Object.keys(fields).forEach((key) => {
    if (validators[key]) {
      const result = validators[key](fields[key]);
      results[key] = result;
      if (!result.isValid) {
        hasErrors = true;
      }
    }
  });
  
  return {
    isValid: !hasErrors,
    results,
  };
}
