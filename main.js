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

  // Hide thumbnail and play button
  thumbnail.style.display = "none";
  playButton.style.display = "none";

  // Show and load the iframe
  iframe.style.display = "block";
  iframe.src = iframe.getAttribute("data-src");

  // Add playing class for additional styling if needed
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

// Animation system
document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "50px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Services section animation
        if (entry.target.classList.contains("services")) {
          const panels = document.querySelectorAll(".service-panel");
          panels.forEach((panel, index) => {
            setTimeout(() => {
              panel.classList.add("animate");
            }, index * 200);
          });
        }

        // Testimonials section animation
        if (entry.target.classList.contains("testimonials")) {
          const title = entry.target.querySelector(".testimonials__title");
          if (title) title.classList.add("animate");

          setTimeout(() => {
            const subtitle = entry.target.querySelector(
              ".testimonials__subtitle"
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

          setTimeout(() => {
            const cta = entry.target.querySelector(".testimonials__cta");
            if (cta) cta.classList.add("animate");
          }, 400 + entry.target.querySelectorAll(".testimonial-card").length * 150 + 300);
        }

        if (entry.target.classList.contains("learnMore")) {
          entry.target.classList.add("animate");
        }

        // Watch section animation
        if (entry.target.classList.contains("watch")) {
          const title = entry.target.querySelector(".watch__title");
          if (title) title.classList.add("animate");

          setTimeout(() => {
            const subtitle = entry.target.querySelector(".watch__subtitle");
            if (subtitle) subtitle.classList.add("animate");
          }, 200);

          setTimeout(() => {
            const videos = entry.target.querySelectorAll(
              ".watch__videos > div"
            );
            videos.forEach((video, index) => {
              setTimeout(() => {
                video.classList.add("animate");
              }, index * 300);
            });
          }, 400);
        }

        // About section animation
        if (entry.target.classList.contains("about")) {
          const imageContainer = entry.target.querySelector(
            ".about__image-container"
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
            setTimeout(() => {
              paragraph.classList.add("animate");
            }, 600 + index * 200);
          });
        }
      }
    });
  }, observerOptions);

  const elementsToObserve = [".services", ".testimonials", ".watch", ".about"];

  // Add individual learnMore sections
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
