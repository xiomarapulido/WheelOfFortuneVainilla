import { MESSAGE_TYPE  } from '../config/messageConfig.js';

export class WheelRenderer {
  constructor(container, segments, winningIndices, onSpinClick, onBackClick) {
    // Initialize instance variables for container, segments, winners, and event callbacks
    this.container = container;
    this.segments = segments;
    this.winningIndices = winningIndices;
    this.onSpinClick = onSpinClick;
    this.onBackClick = onBackClick;

    // Elements that will be created during render
    this.svgWheel = null;
    this.spinBtn = null;
    this.processMessageDiv = null;
    this.backLabel = null;
    this.arrowDiv = null;
  }

  /**
   * Main method to render the entire wheel UI
   * @param {number} attemptsLeft - How many spins are left
   * @param {boolean} isSpinning - Whether the wheel is currently spinning
   * @param {string} prizeMessage - Optional message to show (e.g. prize)
   * @param {string} messageStatus - Status type for the message (success, error, default)
   */
  render(attemptsLeft, isSpinning, prizeMessage = '', messageStatus = '') {
    this.clearContainer();
    this.setupContainerClass();

    const svgNS = "http://www.w3.org/2000/svg";
    const size = 300;
    const radius = size / 2 - 10;
    const center = size / 2;
    const segmentAngle = 360 / this.segments;

    this.createArrowMarker();

    this.svgWheel = this.createSVGWheel(svgNS, size);
    this.renderSegments(svgNS, center, radius, segmentAngle);
    this.renderPointer(svgNS, center);

    this.container.appendChild(this.svgWheel);

    this.createProcessMessageDiv();
    this.createSpinButton(attemptsLeft, isSpinning);
    this.createBackLabel();

    if (prizeMessage) {
      this.showProcessMessage(prizeMessage, messageStatus);
    }
  }

  /** Clears the container's content */
  clearContainer() {
    this.container.innerHTML = '';
  }

  /** Adds the wheel-container CSS class to the container */
  setupContainerClass() {
    this.container.classList.add('wheel-container');
  }

  /** Creates the arrow marker above the wheel */
  createArrowMarker() {
    this.arrowDiv = document.createElement('div');
    this.arrowDiv.classList.add('marker');
    this.container.appendChild(this.arrowDiv);
  }

  /**
   * Creates the SVG element for the wheel
   * @param {string} svgNS - SVG namespace
   * @param {number} size - Width and height of the SVG
   * @returns {SVGElement}
   */
  createSVGWheel(svgNS, size) {
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.classList.add('wheel-svg');
    return svg;
  }

  /**
   * Renders the wheel segments and their labels
   * @param {string} svgNS - SVG namespace
   * @param {number} center - Center coordinate of the wheel
   * @param {number} radius - Radius of the wheel
   * @param {number} segmentAngle - Angle size of each segment in degrees
   */
  renderSegments(svgNS, center, radius, segmentAngle) {
    for (let i = 0; i < this.segments; i++) {
      const startAngle = i * segmentAngle - 90;
      const endAngle = startAngle + segmentAngle;

      // Calculate segment edge points using trigonometry
      const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

      // Create path element for the segment slice
      const path = document.createElementNS(svgNS, 'path');
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      path.setAttribute('d', d);
      path.setAttribute('fill', i % 2 === 0 ? '#000' : '#fff');  // Alternate black and white colors
      path.setAttribute('stroke', '#555');
      path.setAttribute('stroke-width', '1');
      this.svgWheel.appendChild(path);

      // Calculate position for text label within the segment
      const textAngle = startAngle + segmentAngle / 2;
      const textX = center + (radius / 1.7) * Math.cos((textAngle * Math.PI) / 180);
      const textY = center + (radius / 1.7) * Math.sin((textAngle * Math.PI) / 180);

      // Create and position text element inside segment
      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', textX);
      text.setAttribute('y', textY);
      text.setAttribute('fill', i % 2 === 0 ? '#fff' : '#000'); // Contrast text color based on background
      text.classList.add('wheel-segment-text');
      text.textContent = this.winningIndices.includes(i) ? 'WIN' : 'Try Again';
      this.svgWheel.appendChild(text);
    }
  }

  /**
   * Renders the pointer polygon at the top of the wheel
   * @param {string} svgNS - SVG namespace
   * @param {number} center - Center coordinate of the wheel
   */
  renderPointer(svgNS, center) {
    const pointer = document.createElementNS(svgNS, 'polygon');
    pointer.setAttribute('points', `${center - 10},10 ${center + 10},10 ${center},30`);
    pointer.setAttribute('fill', 'transparent');
    this.svgWheel.appendChild(pointer);
  }

  /** Creates the div element for displaying process messages */
  createProcessMessageDiv() {
    this.processMessageDiv = document.createElement('div');
    this.processMessageDiv.classList.add('process-message');
    this.container.appendChild(this.processMessageDiv);
  }

  /**
   * Creates the spin button, sets its state, and attaches click handler
   * @param {number} attemptsLeft - Number of spins left
   * @param {boolean} isSpinning - Whether the wheel is spinning
   */
  createSpinButton(attemptsLeft, isSpinning) {
    this.spinBtn = document.createElement('button');
    this.spinBtn.classList.add('spin-button');
    this.spinBtn.textContent = `Spin (${attemptsLeft} left)`;
    this.spinBtn.disabled = isSpinning || attemptsLeft <= 0;
    this.spinBtn.addEventListener('click', this.onSpinClick);
    this.container.appendChild(this.spinBtn);
  }

  /** Creates the back label and attaches its click handler */
  createBackLabel() {
    this.backLabel = document.createElement('label');
    this.backLabel.textContent = 'Back to form';
    this.backLabel.classList.add('back-label');
    this.backLabel.addEventListener('click', this.onBackClick);
    this.container.appendChild(this.backLabel);
  }

  /**
   * Updates the spin button's text and enabled state
   * @param {number} attemptsLeft - Number of spins left
   * @param {boolean} isSpinning - Whether the wheel is spinning
   */
  updateSpinButton(attemptsLeft, isSpinning) {
    if (this.spinBtn) {
      this.spinBtn.textContent = `Spin (${attemptsLeft} left)`;
      this.spinBtn.disabled = isSpinning || attemptsLeft <= 0;
    }
  }

  /**
   * Displays a message with appropriate styling based on status
   * @param {string} msg - Message text to display
   * @param {string} status - Message type (success, error, default)
   */
  showProcessMessage(msg, status) {
    if (this.processMessageDiv) {
      this.processMessageDiv.textContent = msg;

      // Clear previous message classes
      this.processMessageDiv.classList.remove('message-success', 'message-error', 'message-default');

      // Add class based on message status
      switch (status) {
        case MESSAGE_TYPE.SUCCESS:
          this.processMessageDiv.classList.add('message-success');
          break;
        case MESSAGE_TYPE.ERROR:
          this.processMessageDiv.classList.add('message-error');
          break;
        default:
          this.processMessageDiv.classList.add('message-default');
      }
    }
  }

  /**
   * Animates the spinning of the wheel and triggers a callback when finished
   * @param {number} totalRotation - Degrees to rotate the wheel
   * @param {function} onTransitionEndCallback - Callback after animation completes
   */
  spinWheel(totalRotation, onTransitionEndCallback) {
    // Reset transition and rotation before starting spin
    this.svgWheel.style.transition = 'none';
    this.svgWheel.style.transform = 'rotate(0deg)';

    // Force reflow to apply reset styles immediately
    void this.svgWheel.offsetWidth;

    // Apply transition for spin animation
    this.svgWheel.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
    this.svgWheel.style.transform = `rotate(${totalRotation}deg)`;

    // Listen for the end of the transition to finalize rotation and call callback
    this.svgWheel.addEventListener('transitionend', () => {
      // Normalize final angle to between 0-360 degrees
      const finalAngle = totalRotation % 360;

      // Remove transition and set final transform state
      this.svgWheel.style.transition = 'none';
      this.svgWheel.style.transform = `rotate(${finalAngle}deg)`;

      // Call provided callback function
      onTransitionEndCallback();
    }, { once: true });
  }

  /** Clears the container */
  clear() {
    this.container.innerHTML = '';
  }
}
