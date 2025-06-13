import { FormHandler } from './modules/FormHandler.js';
import { WheelRenderer } from './modules/WheelRenderer.js';
import { PrizeService } from './modules/PrizeService.js';
import { MESSAGE_TEXT } from './config/messageText.js';
import { MESSAGE_TYPE } from './config/messageConfig.js';


export class WheelOfFortune {
  constructor(appContainer) {
    this.appContainer = appContainer;
    this.attemptsLeft = 2;                  // Number of attempts the user has
    this.winningIndices = [0, 3, 6, 9];    // Winning segment indices
    this.segments = 12;                    // Total number of segments on the wheel
    this.isSpinning = false;               // Flag to check if the wheel is spinning
    this.prizeMessage = '';                // Message to show after spin

    this.createUIElements();               // Create and append required DOM elements
    this.initModules();                    // Initialize modules like FormHandler and WheelRenderer

    this.init();                          // Start initial rendering
  }

  // Create and append main UI containers to the app container
  createUIElements() {
    this.formSectionContainer = document.createElement('div');
    this.formSectionContainer.id = 'form-section';
    this.appContainer.appendChild(this.formSectionContainer);

    this.greetingMessageElement = document.createElement('div');
    this.greetingMessageElement.id = 'greetingMessage';
    this.greetingMessageElement.classList.add('message');
    this.appContainer.appendChild(this.greetingMessageElement);

    this.wheelSectionContainer = document.createElement('div');
    this.wheelSectionContainer.id = 'wheelContainer';
    this.wheelSectionContainer.classList.add('wheel-container');
    this.appContainer.appendChild(this.wheelSectionContainer);
  }

  // Initialize external modules and bind necessary callbacks
  initModules() {
    this.formHandler = new FormHandler(
      this.formSectionContainer,
      this.greetingMessageElement,
      this.handleUserLogin.bind(this)    // Bind context for callback
    );
    this.wheelRenderer = new WheelRenderer(
      this.wheelSectionContainer,
      this.segments,
      this.winningIndices,
      this.spin.bind(this),               // Spin button callback
      this.renderForm.bind(this)          // Callback to reset form
    );
    this.prizeService = new PrizeService('prize.json'); // Service to fetch prize info
  }

  // Initial setup to render the form view
  init() {
    this.renderForm();
  }

  // Render the form and reset UI and game state accordingly
  renderForm() {
    this.clearUIForForm();                // Clear wheel and messages
    this.formHandler.render();
    this.formHandler.showForm();
    this.formHandler.resetForm();
    this.resetGameState();                // Reset attempts and state flags
  }

  // Clear the wheel UI and reset messages when showing the form
  clearUIForForm() {
    this.wheelRenderer.clear();
    this.greetingMessageElement.textContent = '';
    this.greetingMessageElement.style.color = '';
    this.wheelSectionContainer.style.display = 'none'; // Hide wheel section
  }

  // Reset game-specific variables to initial state
  resetGameState() {
    this.attemptsLeft = 2;
    this.isSpinning = false;
    this.prizeMessage = '';
  }

  // Called after user login; hide form and show wheel
  handleUserLogin() {
    this.formHandler.hideForm();
    this.showWheelSection();
  }

  // Show wheel container and render it
  showWheelSection() {
    this.wheelSectionContainer.style.display = 'block';
    this.renderWheel();
  }

  // Render the wheel with current state (attempts, spinning flag, message)
  renderWheel() {
    this.wheelRenderer.render(this.attemptsLeft, this.isSpinning, this.prizeMessage);
  }

  // Handle the spin action triggered by user
  spin() {
    if (this.isSpinning || this.attemptsLeft <= 0) return; // Prevent multiple spins or no attempts

    this.isSpinning = true;
    this.updateSpinUIBeforeSpin();         // Update UI before spin starts

    setTimeout(() => {
      const randomSegment = this.getRandomSegment();    // Pick random segment index
      const totalRotation = this.calculateRotation(randomSegment);  // Calculate final rotation angle

      // Animate the spin and handle result when complete
      this.wheelRenderer.spinWheel(totalRotation, () => this.onSpinComplete(randomSegment));
    }, 1000);  // Delay before spin for UX purposes
  }

  // Update spin button and clear messages before spinning
  updateSpinUIBeforeSpin() {
    this.wheelRenderer.updateSpinButton(this.attemptsLeft, this.isSpinning);
    this.wheelRenderer.showProcessMessage('');
  }

  // Calculate the total rotation in degrees to land on the chosen segment
  calculateRotation(segmentIndex) {
    const segmentAngle = 360 / this.segments;
    const rotations = 3;                   // Number of full rotations before stopping
    const stopAngle = 360 - (segmentIndex * segmentAngle) - segmentAngle / 2;
    return rotations * 360 + stopAngle;
  }

  // Return a random integer between 0 and segments-1
  getRandomSegment() {
    return Math.floor(Math.random() * this.segments);
  }

  // Callback after spin animation completes
  onSpinComplete(segmentIndex) {
    this.handleSpinResult(segmentIndex);   // Show prize or try again message
    this.isSpinning = false;
    this.attemptsLeft--;
    this.wheelRenderer.updateSpinButton(this.attemptsLeft, this.isSpinning);
    this.showAttemptStatus();
  }

  // Show message if no attempts left
  showAttemptStatus() {
    if (this.attemptsLeft === 0) {
      this.wheelRenderer.showProcessMessage(MESSAGE_TEXT.NO_ATTEMPTS_LEFT, MESSAGE_TYPE.SUCCESS);
    }
  }

  // Handle the outcome of the spin
  handleSpinResult(segmentIndex) {
    if (this.winningIndices.includes(segmentIndex)) {
      this.fetchAndShowPrize();   // If won, fetch prize info
    } else {
      this.showTryNextTimeMessage(); // Otherwise show 'try again' message
    }
  }

  // Fetch prize data and display success or error message
  fetchAndShowPrize() {
    this.prizeService.fetchPrize()
      .then(prize => {
        this.prizeMessage = MESSAGE_TEXT.WINNING_PRIZE(prize);
        this.wheelRenderer.showProcessMessage(this.prizeMessage, MESSAGE_TYPE.SUCCESS);
      })
      .catch(() => {
        this.prizeMessage = MESSAGE_TEXT.PRIZE_FETCH_ERROR;
        this.wheelRenderer.showProcessMessage(this.prizeMessage, MESSAGE_TYPE.ERROR);
      });
  }

  // Display message encouraging user to try again
  showTryNextTimeMessage() {
    this.prizeMessage = MESSAGE_TEXT.TRY_NEXT_TIME;
    this.wheelRenderer.showProcessMessage(this.prizeMessage, MESSAGE_TYPE.ERROR);
  }
}
