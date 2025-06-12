// js/modules/FormHandler.js
export class FormHandler {
  constructor(container, greetingMessageElement, onLoginSuccessCallback) {
    this.container = container;
    this.greetingMessageElement = greetingMessageElement;
    this.onLoginSuccessCallback = onLoginSuccessCallback;
    this.form = null;
  }

  render() {
    this.container.innerHTML = `
      <h1 style="text-align:center; margin-bottom:10px;">Wheel of Fortune</h1>
      <form id="userForm" novalidate>
        <input type="text" id="name" name="name" placeholder="Name" required />
        <input type="text" id="surname" name="surname" placeholder="Surname" required />
        <input type="email" id="email" name="email" placeholder="Email" required />
        <button type="submit">Start</button>
      </form>
    `;
    this.form = this.container.querySelector('#userForm');
    this.greetingMessageElement.style.textAlign = 'center';
    this.greetingMessageElement.style.marginTop = '10px';

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      if (this.validateForm()) {
        this.handleUserLogin();
      }
    });
  }

  validateForm() {
    const name = this.form.name.value.trim();
    const surname = this.form.surname.value.trim();
    const email = this.form.email.value.trim();

    if (!name || !surname || !email) {
      this.showMessage('Please fill all fields.', 'red');
      return false;
    }

    if (!this.validateEmail(email)) {
      this.showMessage('Invalid email address.', 'red');
      return false;
    }

    this.showMessage('');
    return true;
  }

  validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  handleUserLogin() {
    this.form.style.display = 'none';
    const name = this.form.name.value.trim();
    this.greetingMessageElement.textContent = `Hello, ${name}! Welcome.`;
    this.greetingMessageElement.style.color = 'green';
    this.onLoginSuccessCallback();
  }

  showMessage(msg, color = 'green') {
    this.greetingMessageElement.textContent = msg;
    this.greetingMessageElement.style.color = color;
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