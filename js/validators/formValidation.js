import { MESSAGE_TEXT } from '../config/messageText.js';
import { MESSAGE_TYPE } from '../config/messageConfig.js';

export function validateForm(form) {
  const { name, surname, email } = form;

  if (!name.value.trim() || !surname.value.trim() || !email.value.trim()) {
    return {
      valid: false,
      message: MESSAGE_TEXT.FILL_ALL_FIELDS,
      type: MESSAGE_TYPE.ERROR
    };
  }

  if (!validateEmail(email.value)) {
    return {
      valid: false,
      message: MESSAGE_TEXT.INVALID_EMAIL,
      type: MESSAGE_TYPE.ERROR
    };
  }

  if (containsSpecialChars(name.value) || containsSpecialChars(surname.value)) {
    return {
      valid: false,
      message: MESSAGE_TEXT.CHARACTERS, 
      type: MESSAGE_TYPE.ERROR
    };
  }

  return { valid: true, message: '', type: null };
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function containsSpecialChars(str) {
  const pattern = /^[a-zA-Z\s]*$/;
  return !pattern.test(str);
}
