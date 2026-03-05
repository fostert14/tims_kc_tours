let lastScrollTop = 0;
const topbar = document.querySelector(".header__topbar");

// Navigation hide/show logic
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    topbar.classList.add("hide");
  }
  if (scrollTop < lastScrollTop || scrollTop <= 0) {
    topbar.classList.remove("hide");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Play video function - MUST be global to work with onclick
function playVideo(container) {
  const iframe = container.querySelector(".watch__iframe");
  const thumbnail = container.querySelector(".watch__video-thumbnail");
  const playButton = container.querySelector(".watch__play-button");

  thumbnail.style.display = "none";
  playButton.style.display = "none";

  iframe.style.display = "block";
  iframe.src = iframe.getAttribute("data-src");

  container.classList.add("playing");
}

// Expand Concierge Section
function toggleConciergeDetails() {
  const details = document.getElementById("concierge-details");
  const expandText = document.getElementById("expand-text");
  const previewText = document.querySelector(".concierge__preview-text");

  if (details.classList.contains("show")) {
    details.classList.remove("show");
    expandText.textContent = "Read More";
    previewText.classList.remove("hidden");
  } else {
    details.classList.add("show");
    expandText.textContent = "Read Less";
    previewText.classList.add("hidden");
  }
}

function changeAboutPhoto() {
  const imageElement = document.querySelector(".about__image");
  const currentImage = getComputedStyle(imageElement).backgroundImage;

  if (currentImage.includes("Casual")) {
    imageElement.style.backgroundImage = "url('./images/Horse.webp')";
  } else {
    imageElement.style.backgroundImage = "url('./images/Casual Timmy.webp')";
  }
}

// ============================================
// BOOKING MODAL & CALENDLY INTEGRATION
// ============================================

// Calendly Event URLs - one per tour type / group size
const CALENDLY_EVENTS = {
  underground: {
    1: "https://calendly.com/tim-timskctours/30min",
    2: "https://calendly.com/tim-timskctours/underground-tour-1-person-clone",
    3: "https://calendly.com/tim-timskctours/underground-tour-2-people-clone",
    4: "https://calendly.com/tim-timskctours/underground-tour-3-people-clone",
    5: "https://calendly.com/tim-timskctours/underground-tour-4-people-clone",
  },
  concierge: "https://calendly.com/tim-timskctours/custom-tour",
};

// Track which view to open the modal with
// "tour-select" = full selector, "underground" = group picker, "concierge" = confirm, "airport" = contact
let modalInitialView = "tour-select";
let modalHtml = null;

async function loadModal() {
  if (!modalHtml) {
    try {
      const response = await fetch("bookingModal.html");
      modalHtml = await response.text();
    } catch (error) {
      console.error("Error loading modal:", error);
      return;
    }
  }

  // Remove existing modal if present
  const existingModal = document.getElementById("bookingModal");
  if (existingModal) existingModal.remove();

  // Add modal to page
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Hide all steps first
  const allSteps = document.querySelectorAll(".modal__step");
  allSteps.forEach((step) => step.classList.add("modal__step--hidden"));

  // Show the correct initial view
  if (modalInitialView === "underground") {
    document
      .getElementById("modal-underground")
      .classList.remove("modal__step--hidden");
    // Hide back button when opened directly from service panel
    document.getElementById("underground-back-btn").style.display = "none";
  } else if (modalInitialView === "airport") {
    document
      .getElementById("modal-airport")
      .classList.remove("modal__step--hidden");
  } else {
    // Default: show full tour selector
    document
      .getElementById("modal-tour-select")
      .classList.remove("modal__step--hidden");
  }

  setupModalEventListeners();
}

function setupModalEventListeners() {
  const modal = document.getElementById("bookingModal");
  const closeBtn = modal.querySelector(".modal__close");

  closeBtn.onclick = function () {
    closeModal();
  };

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function handler(event) {
    if (event.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handler);
    }
  });
}

// Main opener - header "Book a Tour" button (shows full tour selector)
function openBookingModal() {
  modalInitialView = "tour-select";
  loadModal().then(() => {
    const modal = document.getElementById("bookingModal");
    if (modal) modal.style.display = "block";
  });
}

// Direct opener - Underground "Book Now" → group size picker
function openUndergroundBooking() {
  modalInitialView = "underground";
  loadModal().then(() => {
    const modal = document.getElementById("bookingModal");
    if (modal) modal.style.display = "block";
  });
}

// Direct opener - Airport "Book Now" → phone/email contact
function openAirportBooking() {
  modalInitialView = "airport";
  loadModal().then(() => {
    const modal = document.getElementById("bookingModal");
    if (modal) modal.style.display = "block";
  });
}

function closeModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) {
    modal.remove();
    modalHtml = null;
  }
}

// Tour selection from the full selector
function selectTour(tourType) {
  if (tourType === "concierge") {
    // Open Calendly directly for concierge
    closeModal();
    Calendly.initPopupWidget({ url: CALENDLY_EVENTS.concierge });
  } else if (tourType === "underground") {
    document
      .getElementById("modal-tour-select")
      .classList.add("modal__step--hidden");
    document
      .getElementById("modal-underground")
      .classList.remove("modal__step--hidden");
    // Show back button when navigating from tour selector
    document.getElementById("underground-back-btn").style.display = "";
  }
}

// Concierge: open Calendly popup for scheduling + payment
function goToConciergePay() {
  closeModal();
  Calendly.initPopupWidget({ url: CALENDLY_EVENTS.concierge });
}

// Underground: group size selection → open Calendly popup
function selectGroupSize(size) {
  const url = CALENDLY_EVENTS.underground[size];
  if (url) {
    closeModal();
    Calendly.initPopupWidget({ url: url });
  }
}

// Back to tour selector
function goBackToTourSelect() {
  document
    .getElementById("modal-underground")
    .classList.add("modal__step--hidden");
  document
    .getElementById("modal-tour-select")
    .classList.remove("modal__step--hidden");
}

// ============================================
// ANIMATION SYSTEM
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "50px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("services")) {
          const panels = document.querySelectorAll(".service-panel");
          panels.forEach((panel, index) => {
            setTimeout(() => {
              panel.classList.add("animate");
            }, index * 200);
          });
        }

        if (entry.target.classList.contains("testimonials")) {
          const title = entry.target.querySelector(".testimonials__title");
          if (title) title.classList.add("animate");

          setTimeout(() => {
            const subtitle = entry.target.querySelector(
              ".testimonials__subtitle",
            );
            if (subtitle) subtitle.classList.add("animate");
          }, 200);

          setTimeout(() => {
            const cards = entry.target.querySelectorAll(".testimonial-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate");
              }, index * 150);
            });
          }, 400);

          setTimeout(
            () => {
              const cta = entry.target.querySelector(".testimonials__cta");
              if (cta) cta.classList.add("animate");
            },
            400 +
              entry.target.querySelectorAll(".testimonial-card").length * 150 +
              300,
          );
        }

        if (entry.target.classList.contains("learnMore")) {
          entry.target.classList.add("animate");
        }

        if (entry.target.classList.contains("watch")) {
          const title = entry.target.querySelector(".watch__title");
          if (title) title.classList.add("animate");

          setTimeout(() => {
            const subtitle = entry.target.querySelector(".watch__subtitle");
            if (subtitle) subtitle.classList.add("animate");
          }, 200);

          setTimeout(() => {
            const videos = entry.target.querySelectorAll(
              ".watch__videos > div",
            );
            videos.forEach((video, index) => {
              setTimeout(() => {
                video.classList.add("animate");
              }, index * 300);
            });
          }, 400);
        }

        if (entry.target.classList.contains("about")) {
          const imageContainer = entry.target.querySelector(
            ".about__image-container",
          );
          if (imageContainer) {
            setTimeout(() => {
              imageContainer.classList.add("animate");
            }, 100);
          }

          const title = entry.target.querySelector(".about__title");
          if (title) {
            setTimeout(() => {
              title.classList.add("animate");
            }, 300);
          }

          const paragraphs = entry.target.querySelectorAll(".about__paragraph");
          paragraphs.forEach((paragraph, index) => {
            setTimeout(
              () => {
                paragraph.classList.add("animate");
              },
              600 + index * 200,
            );
          });
        }
      }
    });
  }, observerOptions);

  const elementsToObserve = [".services", ".testimonials", ".watch", ".about"];

  const learnMoreSections = document.querySelectorAll(".learnMore");
  learnMoreSections.forEach((section) => {
    observer.observe(section);
  });

  elementsToObserve.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      observer.observe(element);
    }
  });
});
