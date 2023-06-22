"use strict";

// Selectors
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnsOpenModal = document.querySelectorAll(".open__modal");
const btnsCloseModal = document.querySelectorAll(".close__modal");
const tabs = document.querySelectorAll(".projects__tab");
const tabContainer = document.querySelector(".projects__btns");
const tabsContent = document.querySelectorAll(".projects__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const sliderButtonLeft = document.querySelector(".slider__btn--left");
const sliderButtonRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
const weather = document.querySelector(".nav__temp");
const contactForm = document.querySelector(".modal__form");
let firstName = document.querySelector(".modal__first-name");
let lastName = document.querySelector(".modal__last-name");
let email = document.querySelector(".modal__email");
let message = document.querySelector(".modal__message");

const apiKey = "251b835b21104ef2a41164226231906";

// Weather API

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const loadWeather = async function (e) {
  try {
    //Geolocation
    const pos = await getPosition();
    const { latitude, longitude } = pos.coords;

    // API call
    const APIRes = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=251b835b21104ef2a41164226231906&q=${latitude},${longitude}&aqi=yes`
    );
    if (!APIRes.ok) throw new Error("Problem getting location data");
    const APIData = await APIRes.json();
    const markup = `
        ${Math.round(APIData.current.temp_f)}°
    `;
    weather.innerHTML = markup;
  } catch (err) {
    throw err;
  }
};
loadWeather();

// Control Contact Modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  
};
// Open modal
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
// Close modal
btnsCloseModal.forEach((btn) => btn.addEventListener("click", closeModal));
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Nav scroll on click
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  const smoothScroll = function(id){
    if(!id) return
    id.scrollIntoView({behavior:"smooth" })
  }
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    smoothScroll(document.querySelector(id))
    
  }
});

// Projects tab
tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".projects__tab");
  console.log(clicked);
  //Guard clause
  if (!clicked) return;

  //remove active classes
  tabs.forEach((t) => t.classList.remove("projects__tab--active"));
  tabs.forEach((t) => t.style.backgroundColor = '#A0ACAE');
  tabsContent.forEach((t) => t.classList.remove("projects__content--active"));

  // Activate tab
  clicked.classList.add("projects__tab--active");
  clicked.style.backgroundColor = 'var(--color-secondary)'

  //Activate content area
  document
    .querySelector(`.projects__content--${clicked.dataset.tab}`)
    .classList.add("projects__content--active");
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky Navigation Intersection Observer API

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("nav__sticky");
  } else {
    nav.classList.remove("nav__sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Slider
let currentSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_slides, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

// left and right buttons
sliderButtonRight.addEventListener("click", nextSlide);
sliderButtonLeft.addEventListener("click", previousSlide);

//left and right keys
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    previousSlide();
  } else if (e.key === "ArrowRight") {
    nextSlide();
  }
});

//dot functionality
dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

// Contact form with emailJS

(function () {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init("RNkxP1tQXrhTZBAXB");
})();

window.onload = function () {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    emailjs
      .sendForm("contact_service", "contact_form", this)
      .then(
        function () {
          console.log("SUCCESS!");
        },
        function (error) {
          console.log("FAILED...", error);
        }
      )
      .then(closeModal())
  })
};
