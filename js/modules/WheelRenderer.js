import { MESSAGE_TYPE  } from '../config/messageConfig.js';

export class WheelRenderer {
  constructor(container, segments, winningIndices, onSpinClick, onBackClick) {
    this.container = container;
    this.segments = segments;
    this.winningIndices = winningIndices;
    this.onSpinClick = onSpinClick;
    this.onBackClick = onBackClick;
    this.svgWheel = null;
    this.spinBtn = null;
    this.processMessageDiv = null;
    this.backLabel = null;
    this.arrowDiv = null;
  }

  render(attemptsLeft, isSpinning, prizeMessage = '', messageStatus = '') {
    this.container.innerHTML = '';
    this.container.classList.add('wheel-container');

    const svgNS = "http://www.w3.org/2000/svg";
    const size = 300;
    const radius = size / 2 - 10;
    const center = size / 2;
    const segmentAngle = 360 / this.segments;

    this.arrowDiv = document.createElement('div');
    this.arrowDiv.classList.add('marker');
    this.container.appendChild(this.arrowDiv);

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.classList.add('wheel-svg');
    this.svgWheel = svg;

    for (let i = 0; i < this.segments; i++) {
      const startAngle = i * segmentAngle - 90;
      const endAngle = startAngle + segmentAngle;

      const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

      const path = document.createElementNS(svgNS, 'path');
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      path.setAttribute('d', d);
      path.setAttribute('fill', i % 2 === 0 ? '#000' : '#fff');
      path.setAttribute('stroke', '#555');
      path.setAttribute('stroke-width', '1');
      svg.appendChild(path);

      const textAngle = startAngle + segmentAngle / 2;
      const textX = center + (radius / 1.7) * Math.cos((textAngle * Math.PI) / 180);
      const textY = center + (radius / 1.7) * Math.sin((textAngle * Math.PI) / 180);

      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', textX);
      text.setAttribute('y', textY);
      text.setAttribute('fill', i % 2 === 0 ? '#fff' : '#000');
      text.classList.add('wheel-segment-text');
      text.textContent = this.winningIndices.includes(i) ? 'WIN' : 'Try Again';
      svg.appendChild(text);
    }

    const pointer = document.createElementNS(svgNS, 'polygon');
    pointer.setAttribute('points', `${center - 10},10 ${center + 10},10 ${center},30`);
    pointer.setAttribute('fill', 'transparent');
    svg.appendChild(pointer);

    this.container.appendChild(svg);

    this.processMessageDiv = document.createElement('div');
    this.processMessageDiv.classList.add('process-message');
    this.container.appendChild(this.processMessageDiv);

    this.spinBtn = document.createElement('button');
    this.spinBtn.classList.add('spin-button');
    this.spinBtn.textContent = `Spin (${attemptsLeft} left)`;
    this.spinBtn.disabled = isSpinning || attemptsLeft <= 0;
    this.spinBtn.addEventListener('click', this.onSpinClick);
    this.container.appendChild(this.spinBtn);

    this.backLabel = document.createElement('label');
    this.backLabel.textContent = 'Back to form';
    this.backLabel.classList.add('back-label');
    this.backLabel.addEventListener('click', this.onBackClick);
    this.container.appendChild(this.backLabel);

    if (prizeMessage) {
      this.showProcessMessage(prizeMessage, messageStatus);
    }
  }

  updateSpinButton(attemptsLeft, isSpinning) {
    if (this.spinBtn) {
      this.spinBtn.textContent = `Spin (${attemptsLeft} left)`;
      this.spinBtn.disabled = isSpinning || attemptsLeft <= 0;
    }
  }

  showProcessMessage(msg, status) {
    if (this.processMessageDiv) {
      this.processMessageDiv.textContent = msg;

      // Limpiar clases previas
      this.processMessageDiv.classList.remove('message-success', 'message-error', 'message-default');

      // Agregar clase según status
      switch (status) {
        case 'success':
          this.processMessageDiv.classList.add('message-success');
          break;
        case 'error':
          this.processMessageDiv.classList.add('message-error');
          break;
        default:
          this.processMessageDiv.classList.add('message-default');
      }
    }
  }

  spinWheel(totalRotation, onTransitionEndCallback) {
    this.svgWheel.style.transition = 'none';
    this.svgWheel.style.transform = 'rotate(0deg)';

    void this.svgWheel.offsetWidth; // Force reflow

    this.svgWheel.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
    this.svgWheel.style.transform = `rotate(${totalRotation}deg)`;

    this.svgWheel.addEventListener('transitionend', () => {
      const finalAngle = totalRotation % 360;
      this.svgWheel.style.transition = 'none';
      this.svgWheel.style.transform = `rotate(${finalAngle}deg)`;

      onTransitionEndCallback();
    }, { once: true });
  }

  clear() {
    this.container.innerHTML = '';
  }
}
