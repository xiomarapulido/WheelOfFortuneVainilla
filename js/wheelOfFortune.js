// wheelOfFortune.js
export class WheelOfFortune {
  constructor(container) {
    this.container = container;
    this.attemptsLeft = 2;
    this.winningIndices = [0, 3, 6, 9]; // Posiciones ganadoras
    this.segments = 12;
    this.isSpinning = false;
    this.prizeMessage = '';
    this.init();
  }

  init() {
    this.renderForm();
  }

  renderForm() {
    this.container.innerHTML = `
      <h1 style="text-align:center; margin-bottom:20px;">Wheel of Fortune</h1>
      <form id="userForm" novalidate>
        <input type="text" id="name" name="name" placeholder="Name" required />
        <input type="text" id="surname" name="surname" placeholder="Surname" required />
        <input type="email" id="email" name="email" placeholder="Email" required />
        <button type="submit">Start</button>
      </form>
      <div id="greetingMessage" class="message"></div>
      <div id="wheelContainer" class="wheel-container"></div>
    `;
    this.form = this.container.querySelector('#userForm');
    this.greetingMessage = this.container.querySelector('#greetingMessage');
    this.wheelContainer = this.container.querySelector('#wheelContainer');

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
    // Ocultar formulario, pero mantener el saludo
    this.form.style.display = 'none';

    const name = this.form.name.value.trim();
    this.greetingMessage.textContent = `Hola, ${name}! Bienvenido.`;
    this.greetingMessage.style.color = 'green';

    this.renderWheel();
  }

  renderWheel() {
    // Limpiar contenido de ruleta
    this.wheelContainer.innerHTML = '';

    // Flecha roja arriba (marcador)
    const arrowDiv = document.createElement('div');
    arrowDiv.classList.add('marker');
    this.wheelContainer.appendChild(arrowDiv);

    // Crear SVG ruleta blanco y negro
    const svgNS = "http://www.w3.org/2000/svg";
    const size = 300;
    const radius = size / 2 - 10;
    const center = size / 2;
    const segmentAngle = 360 / this.segments;

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';

    for (let i = 0; i < this.segments; i++) {
      const startAngle = i * segmentAngle - 90;
      const endAngle = startAngle + segmentAngle;

      const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);

      const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

      const path = document.createElementNS(svgNS, 'path');
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      const d = 
        `M ${center} ${center} 
        L ${x1} ${y1} 
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
        Z`;
      path.setAttribute('d', d);
      // Blanco y negro alternado
      path.setAttribute('fill', i % 2 === 0 ? '#000' : '#fff');
      path.setAttribute('stroke', '#555');
      path.setAttribute('stroke-width', '1');
      svg.appendChild(path);

      // Texto pequeño y blanco
      const textAngle = startAngle + segmentAngle / 2;
      const textX = center + (radius / 1.7) * Math.cos((textAngle * Math.PI) / 180);
      const textY = center + (radius / 1.7) * Math.sin((textAngle * Math.PI) / 180);

      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', textX);
      text.setAttribute('y', textY);
      text.setAttribute('fill', i % 2 === 0 ? '#fff' : '#000'); // texto blanco sobre negro y negro sobre blanco para legibilidad
      text.setAttribute('font-size', '10');
      text.setAttribute('font-family', 'Arial, sans-serif');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('alignment-baseline', 'middle');
      text.style.userSelect = 'none';
      text.textContent = this.winningIndices.includes(i) ? 'WIN' : 'Try Again';
      svg.appendChild(text);
    }

    // Puntero triángulo rojo arriba
    const pointer = document.createElementNS(svgNS, 'polygon');
    pointer.setAttribute('points', `${center - 10},10 ${center + 10},10 ${center},30`);
    pointer.setAttribute('fill', 'red');
    svg.appendChild(pointer);

    this.wheelContainer.appendChild(svg);
    this.svgWheel = svg;

    this.renderSpinButton();

    // Botón para volver al formulario **debajo** de la ruleta y mensaje
    if (this.backBtn) this.backBtn.remove();
    this.backBtn = document.createElement('button');
    this.backBtn.textContent = 'Volver al formulario';
    this.backBtn.style.marginTop = '15px';
    this.backBtn.addEventListener('click', () => {
      this.attemptsLeft = 2;
      this.isSpinning = false;
      this.prizeMessage = '';
      this.renderForm();
    });
    this.wheelContainer.appendChild(this.backBtn);
  }

  renderSpinButton() {
    if (this.spinBtn) this.spinBtn.remove();

    this.spinBtn = document.createElement('button');
    this.spinBtn.classList.add('spin-button');
    this.spinBtn.textContent = `Spin (${this.attemptsLeft} left)`;
    this.spinBtn.disabled = this.isSpinning || this.attemptsLeft <= 0;
    this.spinBtn.addEventListener('click', () => this.spin());

    this.wheelContainer.appendChild(this.spinBtn);
  }

  spin() {
    if (this.isSpinning || this.attemptsLeft <= 0) return;
    this.isSpinning = true;
    this.spinBtn.disabled = true;
    this.showMessage('');

    const randomSegment = this.getRandomSegment();
    const segmentAngle = 360 / this.segments;
    const rotations = 3;
    const stopAngle = 360 - (randomSegment * segmentAngle) - segmentAngle / 2;
    const totalRotation = rotations * 360 + stopAngle;

    this.svgWheel.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
    this.svgWheel.style.transform = `rotate(${totalRotation}deg)`;

    this.svgWheel.addEventListener('transitionend', () => {
      this.handleSpinResult(randomSegment);
      this.isSpinning = false;
      this.attemptsLeft--;
      this.renderSpinButton();

      if (this.attemptsLeft === 0) {
        this.showMessage('No more attempts. Thank you for playing!');
      }
    }, { once: true });
  }

  getRandomSegment() {
    return Math.floor(Math.random() * this.segments);
  }

  handleSpinResult(segmentIndex) {
    if (this.winningIndices.includes(segmentIndex)) {
      this.fetchPrize()
        .then(prize => {
          this.showMessage(`Congratulations! You won: ${prize}`);
        })
        .catch(() => {
          this.showMessage('You won! But could not retrieve prize info.', 'orange');
        });
    } else {
      this.showMessage('Try next time!');
    }
  }

  fetchPrize() {
    const url = 'prize.json';
    return fetch(url, { mode: 'cors' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => data.prize);
  }

  showMessage(msg, color = 'green') {
    this.greetingMessage.textContent = msg;
    this.greetingMessage.style.color = color;
  }
}
