import { MESSAGE_TEXT } from '../config/messageText.js';
import { MESSAGE_TYPE } from '../config/messageConfig.js';

/**
 * Validates the given form object fields: name, surname, and email.
 * Returns an object indicating if the form is valid along with message and type.
 * 
 * @param {Object} form - The form object containing name, surname, email fields.
 * @returns {Object} - Validation result: { valid: boolean, message: string, type: string|null }
 */
export function validateForm(form) {
  // Destructure form fields
  const { name, surname, email } = form;

  // Check if any field is empty or contains only whitespace
  if (!name.value.trim() || !surname.value.trim() || !email.value.trim()) {
    return {
      valid: false,
      message: MESSAGE_TEXT.FILL_ALL_FIELDS,  // Message prompting to fill all fields
      type: MESSAGE_TYPE.ERROR                 // Error type
    };
  }

  // Validate email format using regex
  if (!validateEmail(email.value)) {
    return {
      valid: false,
      message: MESSAGE_TEXT.INVALID_EMAIL,    // Message indicating invalid email
      type: MESSAGE_TYPE.ERROR
    };
  }

  // Check if name or surname contains special characters (only letters and spaces allowed)
  if (containsSpecialChars(name.value) || containsSpecialChars(surname.value)) {
    return {
      valid: false,
      message: MESSAGE_TEXT.CHARACTERS,       // Message for invalid characters
      type: MESSAGE_TYPE.ERROR
    };
  }

  // If all validations pass, return valid true with no message or type
  return { valid: true, message: '', type: null };
}

/**
 * Validates the format of an email string using a regex pattern.
 * 
 * @param {string} email - Email string to validate.
 * @returns {boolean} - True if email is valid, false otherwise.
 */
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;  // Basic email pattern: something@something.something
  return re.test(email);
}

/**
 * Checks if the string contains characters other than letters and spaces.
 * 
 * @param {string} str - String to check.
 * @returns {boolean} - True if special characters are present, false otherwise.
 */
function containsSpecialChars(str) {
  const pattern = /^[a-zA-Z\s]*$/;  // Only allows letters (uppercase/lowercase) and spaces
  return !pattern.test(str);
}
