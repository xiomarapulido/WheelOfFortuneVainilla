import { FormHandler } from './modules/FormHandler.js';
import { WheelRenderer } from './modules/WheelRenderer.js';
import { PrizeService } from './modules/PrizeService.js';
import { MESSAGE_TEXT } from './config/messageText.js';
import { MESSAGE_TYPE } from './config/messageConfig.js';

export class WheelOfFortune {
  constructor(appContainer) {
    this.appContainer = appContainer;
    this.attemptsLeft = 2;
    this.winningIndices = [0, 3, 6, 9];
    this.segments = 12;
    this.isSpinning = false;
    this.prizeMessage = '';

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

    this.formHandler = new FormHandler(this.formSectionContainer, this.greetingMessageElement, this.handleUserLogin.bind(this));
    this.wheelRenderer = new WheelRenderer(
      this.wheelSectionContainer,
      this.segments,
      this.winningIndices,
      this.spin.bind(this),
      this.renderForm.bind(this)
    );
    this.prizeService = new PrizeService('prize.json');

    this.init();
  }

  init() {
    this.renderForm();
  }

  renderForm() {
    this.wheelRenderer.clear();
    this.greetingMessageElement.textContent = '';
    this.greetingMessageElement.style.color = '';

    this.formHandler.render();
    this.formHandler.showForm();
    this.formHandler.resetForm();

    this.wheelSectionContainer.style.display = 'none';

    this.attemptsLeft = 2;
    this.isSpinning = false;
    this.prizeMessage = '';
  }

  handleUserLogin() {
    this.formHandler.hideForm();
    this.renderWheel();
  }

  renderWheel() {
    this.wheelSectionContainer.style.display = 'block';
    this.wheelRenderer.render(this.attemptsLeft, this.isSpinning, this.prizeMessage);
  }

  spin() {
    if (this.isSpinning || this.attemptsLeft <= 0) return;

    this.isSpinning = true;
    this.wheelRenderer.updateSpinButton(this.attemptsLeft, this.isSpinning);
    this.wheelRenderer.showProcessMessage('');

    setTimeout(() => {

      const randomSegment = this.getRandomSegment();
      const segmentAngle = 360 / this.segments;
      const rotations = 3;
      const stopAngle = 360 - (randomSegment * segmentAngle) - segmentAngle / 2;
      const totalRotation = rotations * 360 + stopAngle;

      this.wheelRenderer.spinWheel(totalRotation, () => {
        this.handleSpinResult(randomSegment);
        this.isSpinning = false;
        this.attemptsLeft--;
        this.wheelRenderer.updateSpinButton(this.attemptsLeft, this.isSpinning);

        if (this.attemptsLeft === 0) {
          this.wheelRenderer.showProcessMessage(MESSAGE_TEXT.NO_ATTEMPTS_LEFT, MESSAGE_TYPE.SUCCESS);
        }
      });
    }, 1000);
  }

  getRandomSegment() {
    return Math.floor(Math.random() * this.segments);
  }

  handleSpinResult(segmentIndex) {
    if (this.winningIndices.includes(segmentIndex)) {
      this.prizeService.fetchPrize()
        .then(prize => {
          this.prizeMessage = MESSAGE_TEXT.WINNING_PRIZE(prize);
          this.wheelRenderer.showProcessMessage(this.prizeMessage, MESSAGE_TYPE.SUCCESS);
        })
        .catch(() => {
          this.prizeMessage = MESSAGE_TEXT.PRIZE_FETCH_ERROR;
          this.wheelRenderer.showProcessMessage(this.prizeMessage, MESSAGE_TYPE.ERROR);
        });
    } else {
      this.prizeMessage = MESSAGE_TEXT.TRY_NEXT_TIME;
      this.wheelRenderer.showProcessMessage(this.prizeMessage, MESSAGE_TYPE.ERROR);
    }
  }
}
