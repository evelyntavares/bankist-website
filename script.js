'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');

const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');

const nav = document.querySelector('.nav');
const imageTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Page navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const elementId = e.target.getAttribute('href');
    document.querySelector(elementId).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
tabsContainer.addEventListener('click', event => {
  const clicked = event.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  const dataTab = clicked.getAttribute('data-tab');
  tabContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${dataTab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });

    const logo = link.closest('.nav').querySelector('img');
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
const stickyNavObserverCallback = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const navHeight = nav.getBoundingClientRect().height;

const headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(
  stickyNavObserverCallback,
  headerObserverOptions
);
headerObserver.observe(header);

// Reveal section
const revealSectionCallback = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const revealSectionOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  revealSectionCallback,
  revealSectionOptions
);

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const loadImageCallback = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    imageObserver.unobserve(entry.target);
  }
};

const loadImageOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imageObserver = new IntersectionObserver(
  loadImageCallback,
  loadImageOptions
);

imageTargets.forEach(image => {
  imageObserver.observe(image);
});

// Slider
let currentSlide = 0;
const lastSlide = slides.length;

const goToSlide = function (slideNumber) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - slideNumber) * 100}%)`;
  });
};

const goToNextSlide = function () {
  if (currentSlide === lastSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const goToPreviousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = lastSlide - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const createDots = function () {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

const activateDot = function (slideNumber) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slideNumber}"]`)
    .classList.add('dots__dot--active');
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};

init();

const buttonLeft = document.querySelector('.slider__btn--left');
const buttonRight = document.querySelector('.slider__btn--right');

buttonRight.addEventListener('click', goToNextSlide);
buttonLeft.addEventListener('click', goToPreviousSlide);

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    goToPreviousSlide();
  }
  if (event.key === 'ArrowRight') {
    goToNextSlide();
  }
});

dotContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    const slideNumber = event.target.dataset.slide;
    goToSlide(slideNumber);
    activateDot(slideNumber);
  }
});
