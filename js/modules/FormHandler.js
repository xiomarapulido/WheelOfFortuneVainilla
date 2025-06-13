import { MESSAGE_TYPE, MESSAGE_CLASS } from '../config/messageConfig.js';
import { MESSAGE_TEXT } from '../config/messageText.js';
import { validateForm } from '../validators/formValidation.js';

export class FormHandler {
  constructor(container, greetingMessageElement, onLoginSuccessCallback) {
    this.container = container;
    this.greetingMessageElement = greetingMessageElement;
    this.onLoginSuccessCallback = onLoginSuccessCallback;
    this.form = null;
  }

  render() {
    this.container.innerHTML = `
      <h1 class="form-title">Wheel of Fortune</h1>
      <form id="userForm" novalidate>
        <input type="text" id="name" name="name" placeholder="Name" required />
        <input type="text" id="surname" name="surname" placeholder="Surname" required />
        <input type="email" id="email" name="email" placeholder="Email" required />
        <button type="submit">Start</button>
      </form>
    `;

    this.form = this.container.querySelector('#userForm');
    this.greetingMessageElement.classList.add('form-message');

    this.form.addEventListener('submit', e => {
      e.preventDefault();

      const validationResult = validateForm(this.form);

      if (!validationResult.valid) {
        this.showMessage(validationResult.message, validationResult.type);
        return;
      }

      this.showMessage('');
      this.handleUserLogin();
    });
  }

  handleUserLogin() {
    this.form.style.display = 'none';
    const name = this.form.name.value.trim();
    this.greetingMessageElement.textContent = MESSAGE_TEXT.WELCOME(name);
    this.setMessageClass(MESSAGE_TYPE.SUCCESS);
    this.onLoginSuccessCallback();
  }

  showMessage(message, type) {
    this.greetingMessageElement.textContent = message;
    this.setMessageClass(type);
  }

  setMessageClass(type) {
    Object.values(MESSAGE_CLASS).forEach(cls =>
      this.greetingMessageElement.classList.remove(cls)
    );

    if (type && MESSAGE_CLASS[type]) {
      this.greetingMessageElement.classList.add(MESSAGE_CLASS[type]);
    }
  }

  hideForm() {
    if (this.form) {
      this.form.style.display = 'none';
    }
  }

  showForm() {
    if (this.form) {
      this.form.style.display = 'block';
    }
  }

  resetForm() {
    if (this.form) {
      this.form.reset();
      this.showMessage('');
    }
  }
}
