'use strict';

//Selecting elements

const settingsToolbarBtn = document.querySelector('.settings__toolbar');
const headerContainer = document.querySelector('.header');
const settingsToolbarToggleBtn = document.querySelector('.settings__toolbar__toggle');
const closingPlacement = document.querySelector('.container');
const defaultFontSize = document.querySelector('html');
let initialFontSize = getComputedStyle(defaultFontSize).fontSize;
const resizePlusLink = document.querySelector('.resize__plus');
const resizeMinusLink = document.querySelector('.resize__minus');
const greyscaleFilterBtn = document.querySelector('.btn__greyscale');
const htmlSelector = document.getElementsByTagName('HTML')[0];
const highContrastBtn = document.querySelector('.btn__highContrast');
const switchedColorsBtn = document.querySelector('.btn__switchedColors');
const lightBackground = document.querySelector('.btn__lightBackground');
const linksUnderline = document.querySelector('.btn__linksUnderline');
const basicFont = document.querySelector('.btn__basicFont');
const resetBtn = document.querySelector('.btn__reset');

//Contact form
const contactButton = document.querySelector('.contactButton');
const messageAfterSending = document.querySelector('.textarea__message');
const tabs = document.querySelectorAll('.btn__btn__tab');
const tabContainer = document.querySelector('.btn__btn__tab-container');
const tabsContent = document.querySelectorAll('.textarea__content');
const tabsMsgContent = document.querySelectorAll('.message__content');
const textareaMessage = document.getElementById('output');
//Popup
const popupButtonContact = document.querySelectorAll('.popup__btn');
const popupCloses = document.querySelectorAll('.close');
//Carousel
const firstProfile = document.querySelector('.first__profile');
const carousel = document.querySelector('.wrapper__carousel');
const arrowIcons = document.querySelectorAll('.wrapper__arrow');

class App {
  isDragging;
  positionDiff;

  constructor(isDragStart, isDragging, prevPageX, prevScrollLeft, firstProfileWidth, scrollWidth, positionDiff) {
    //prettier-ignore
    this.isDragging = false;
    this.isDragStart = false;
    this.prevPageX = prevPageX;
    this.prevScrollLeft = prevScrollLeft;
    this.firstProfileWidth = firstProfile.clientWidth + 10; //getting first profile width & adding 14 margin value
    this.scrollWidth = carousel.scrollWidth - carousel.clientWidth; //getting max scrollable width;
    this.positionDiff = positionDiff;
    //Setting app
    this._loadHeader();
    this._init();
    this._initToolbarPosition();
    this._mapLocation();
    this._showPopup();
    this._closePopup();
    this._popupContact();

    //Attaching event handlers
    settingsToolbarToggleBtn.addEventListener('click', this._toolbarPosition.bind(this));
    closingPlacement.addEventListener('click', this._initToolbarPosition.bind(this));
    document.addEventListener('keydown', this._closeToolbar.bind(this));
    resizePlusLink.addEventListener('click', this._resizePlus);
    resizeMinusLink.addEventListener('click', this._resizeMinus);
    greyscaleFilterBtn.addEventListener('click', this._addGreyScale.bind(this));
    highContrastBtn.addEventListener('click', this._addHighContrast.bind(this));
    switchedColorsBtn.addEventListener('click', this._switchColors.bind(this));
    lightBackground.addEventListener('click', this._lightenBackground.bind(this));
    linksUnderline.addEventListener('click', this._paintLinks.bind(this));
    basicFont.addEventListener('click', this._fontToBasic);
    resetBtn.addEventListener('click', this._reset.bind(this));
    tabContainer.addEventListener('click', (e) => {
      const clicked = e.target.closest('.btn__btn__tab');
      if (!clicked) return;
      //Removing active classes
      tabsContent.forEach((c) => c.classList.remove(`textarea__content--active`));
      tabsMsgContent.forEach((c) => c.classList.remove('message__content--active'));

      //Activate content area
      document.querySelector(`.textarea__content--${clicked.dataset.tab}`).classList.add('textarea__content--active');
      document.querySelector(`.message__content--${clicked.dataset.tab}`).classList.add('message__content--active');
    });

    contactButton.addEventListener('click', this._showElement.bind(this));
    contactButton.addEventListener('click', this._cleanTextarea.bind(this));
    textareaMessage.addEventListener('click', this._hideElement.bind(this));

    //carousel
    carousel.addEventListener('mousedown', this._dragStart.bind(this));
    carousel.addEventListener('touchstart', this._dragStart.bind(this));

    carousel.addEventListener('mousemove', this._dragging.bind(this));
    carousel.addEventListener('touchmove', this._dragging.bind(this));

    carousel.addEventListener('mouseup', this._dragStop.bind(this));
    carousel.addEventListener('mouseleave', this._dragStop.bind(this));
    carousel.addEventListener('touchend', this._dragStop.bind(this));

    arrowIcons.forEach((icon) => {
      icon.addEventListener('click', () => {
        carousel.scrollLeft += icon.id == 'left' ? -this.firstProfileWidth : this.firstProfileWidth;
        setTimeout(() => this._showHideIcons(), 60);
      });
    });
  }

  async _loadHeader() {
    try {
      const markup = `
        <div class="headerContainer">
        <div class="headerContainer__text heading__primary">
            <h1><span class="heading__primary--main"> <span class="first-word">Fundacja</span> Praesterno </span>
            </h1>
            <h1><span class="heading__primary--sub">spotkajmy się we Wrocławiu</span></h1>
        </div>
        <div class="btn header__btn"><a class="btn__btn btn__btn--white btn__btn--animated " href="#aboutSection">Poznaj nas</a>
        </div> 
    </div>
        `;
      headerContainer.innerHTML = '';
      headerContainer.insertAdjacentHTML('afterBegin', markup);
    } catch (err) {
      alert(err);
    }
  }

  _init() {
    htmlSelector.classList.remove('basicFont');
    htmlSelector.classList.remove('linksUnderline');
    htmlSelector.classList.remove('lightBackground');
    htmlSelector.classList.remove('switchedColors');
    htmlSelector.classList.remove('contrast');
    htmlSelector.classList.remove('greyscaleFilter');

    console.log(defaultFontSize);
    console.log(initialFontSize);
  }

  _initToolbarPosition() {
    settingsToolbarBtn.classList.add('toolbar__closed');
  }

  _toolbarPosition() {
    settingsToolbarBtn.classList.toggle('toolbar__closed');
  }

  _closeToolbar(e) {
    if (e.key === 'Escape' && !settingsToolbarBtn.classList.contains('toolbar__closed')) {
      this._toolbarPosition();
    }
  }

  _showElement() {
    messageAfterSending.classList.remove('hide');
  }

  _hideElement() {
    messageAfterSending.classList.add('hide');
  }

  _cleanTextarea() {
    textareaMessage.value = '';
  }

  //Position on map
  _mapLocation() {
    const map = L.map('map').setView([51.1012334, 17.0407848], 17);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([51.1012334, 17.0407848]).addTo(map).bindPopup('ul. Tadeusza Kościuszki 80<br> Wejście od podwórka, obok trzonolinowca.').openPopup();
  }

  //Font size increasing
  _resizePlus() {
    const currentFontSize = parseFloat(getComputedStyle(defaultFontSize).fontSize);

    console.log(currentFontSize);
    console.log(parseFloat(initialFontSize));

    if (currentFontSize < '14' && initialFontSize === '10px') {
      const newFontSizePlus = currentFontSize + 1;
      if (!newFontSizePlus) return;
      defaultFontSize.style.fontSize = `${newFontSizePlus}px`;
    } else if (parseFloat(initialFontSize) < 8) {
      const newFontSizePlus = parseFloat(initialFontSize) + 2;
      if (!newFontSizePlus) return;
      defaultFontSize.style.fontSize = `${newFontSizePlus}px`;
    }
  }

  //Font size decreasing
  _resizeMinus() {
    const currentFontSize = parseFloat(getComputedStyle(defaultFontSize).fontSize);

    if (currentFontSize != '10' && initialFontSize === '10px') {
      const newFontSizeMinus = currentFontSize - 1;
      defaultFontSize.style.fontSize = `${newFontSizeMinus}px`;
    } else if (parseFloat(initialFontSize)) {
      const newFontSizeMinus = parseFloat(initialFontSize);
      defaultFontSize.style.fontSize = `${newFontSizeMinus}px`;
    }
  }

  //greyscale filter
  _addGreyScale() {
    if (!htmlSelector.classList.contains('greyscaleFilter')) {
      this._init();
      htmlSelector.classList.add('greyscaleFilter');
    } else {
      htmlSelector.classList.remove('greyscaleFilter');
    }
  }

  //high contrast
  _addHighContrast() {
    if (!htmlSelector.classList.contains('contrast')) {
      this._init();
      htmlSelector.classList.add('contrast');
    } else {
      htmlSelector.classList.remove('contrast');
    }
  }

  //switchedColors
  _switchColors() {
    if (!htmlSelector.classList.contains('switchedColors')) {
      this._init();
      htmlSelector.classList.add('switchedColors');
    } else {
      htmlSelector.classList.remove('switchedColors');
    }
  }

  // Light background
  _lightenBackground() {
    if (!htmlSelector.classList.contains('lightBackground')) {
      this._init();
      htmlSelector.classList.add('lightBackground');
    } else {
      htmlSelector.classList.remove('lightBackground');
    }
  }

  //link underline
  _paintLinks() {
    htmlSelector.classList.toggle('linksUnderline');
  }

  //basic font
  _fontToBasic() {
    htmlSelector.classList.toggle('basicFont');
  }

  //reset
  _reset() {
    this._init();
    if (initialFontSize !== '6px') {
      defaultFontSize.style.fontSize = initialFontSize;
    }
  }

  //show popup
  _showPopup() {
    let buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      button.onclick = function () {
        let popupId = this.dataset.popup;
        let popup = document.getElementById(popupId);
        popup.classList.remove('popup__hidden');
      };
    }
  }

  //close popup
  _closePopup() {
    for (let close of popupCloses) {
      close.onclick = function () {
        this.closest('.popup').classList.add('popup__hidden');
      };
    }
  }

  _popupContact() {
    for (let button of popupButtonContact) {
      button.onclick = function () {
        //Removing active classes
        tabsContent.forEach((c) => c.classList.remove(`textarea__content--active`));
        tabsMsgContent.forEach((c) => c.classList.remove('message__content--active'));

        //Activate content area
        document.querySelector(`.textarea__content--2`).classList.add('textarea__content--active');
        document.querySelector(`.message__content--2`).classList.add('message__content--active');
      };
    }
  }

  _dragStart(e) {
    //updating global value on mouse down event
    this.isDragStart = true;
    this.prevPageX = e.pageX || e.touches[0].pageX;
    this.prevScrollLeft = carousel.scrollLeft;
  }

  _dragging(e) {
    //scrolling items to left according to mouse pointer
    if (!this.isDragStart) return;
    e.preventDefault();
    this.isDragging = true;
    carousel.classList.add('dragging');
    this.positionDiff = (e.pageX || e.touches[0].pageX) - this.prevPageX;
    carousel.scrollLeft = this.prevScrollLeft - this.positionDiff;
    this._showHideIcons();
  }

  _dragStop() {
    this.isDragStart = false;
    carousel.classList.remove('dragging');

    if (!this.isDragging) return;
    this.isDragging = false;
    this._autoSlide();
  }

  _showHideIcons() {
    //showing and hiding prev/next icon according to carousel scroll left value
    arrowIcons[0].style.display = carousel.scrollLeft === 0 ? 'none' : 'block';
    arrowIcons[1].style.display = carousel.scrollLeft === this.scrollWidth ? 'none' : 'block';
  }

  _autoSlide() {
    if (carousel.scrollLeft === carousel.scrollWidth - carousel.clientWidth) return;

    this.positionDiff = Math.abs(this.positionDiff);
    let valDifference = this.firstProfileWidth - this.positionDiff;

    if (carousel.scrollLeft > this.prevScrollLeft) {
      return (carousel.scrollLeft += this.positionDiff > this.firstProfileWidth / 3 ? valDifference : -this.positionDiff);
    } else {
      return (carousel.scrollLeft -= this.positionDiff > this.firstProfileWidth / 3 ? valDifference : -this.positionDiff);
    }
    console.log(valDifference);
  }
}
const app = new App();
