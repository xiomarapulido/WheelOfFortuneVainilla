import { MESSAGE_TYPE, MESSAGE_CLASS } from '../config/messageConfig.js';
import { MESSAGE_TEXT } from '../config/messageText.js';
import { validateForm } from '../validators/formValidation.js';

export class FormHandler {
  constructor(container, greetingMessageElement, onLoginSuccessCallback) {
    this.container = container;
    this.greetingMessageElement = greetingMessageElement;
    this.onLoginSuccessCallback = onLoginSuccessCallback;
    this.form = null;

    // Bind submit handler 
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    // Inject form HTML template
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

    // Attach submit event listener
    this.form.addEventListener('submit', this.handleSubmit);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Validate form inputs
    const validationResult = validateForm(this.form);

    if (!validationResult.valid) {
      this.showMessage(validationResult.message, validationResult.type);
      return;
    }

    this.showMessage('');
    this.handleUserLogin();
  }

  handleUserLogin() {
    // Hide form on successful login
    this.hideForm();

    // Get trimmed name input value
    const name = this.form.name.value.trim();

    // Show success welcome message
    this.showMessage(MESSAGE_TEXT.WELCOME(name), MESSAGE_TYPE.SUCCESS);

    // Trigger callback after login
    this.onLoginSuccessCallback();
  }

  showMessage(message, type) {
    this.greetingMessageElement.textContent = message;
    this.setMessageClass(type);
  }

  setMessageClass(type) {
    // Remove all existing message classes
    Object.values(MESSAGE_CLASS).forEach(cls =>
      this.greetingMessageElement.classList.remove(cls)
    );

    // Add CSS class based on message type
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
