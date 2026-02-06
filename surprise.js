// --------------------------
// Background music
// --------------------------
const music = new Audio("song.mp3");
music.loop = true;

// Resume from saved time if available
const savedTime = localStorage.getItem("musicTime");
if (savedTime) music.currentTime = parseFloat(savedTime);

// Autoplay on first interaction (or try immediately)
music.play().catch(e => console.log("Autoplay prevented:", e));

// Save playback time every second
setInterval(() => {
  localStorage.setItem("musicTime", music.currentTime);
}, 1000);

// =========================
// HEARTS
// =========================
const heartContainer = document.createElement("div");
heartContainer.style.position = "fixed";
heartContainer.style.top = 0;
heartContainer.style.left = 0;
heartContainer.style.width = "100%";
heartContainer.style.height = "100%";
heartContainer.style.pointerEvents = "none";
heartContainer.style.overflow = "hidden";
document.body.appendChild(heartContainer);

function createHeart() {
  const heart = document.createElement("div");
  heart.textContent = "❤";
  heart.style.position = "absolute";
  heart.style.color = "#ff6b81";
  heart.style.fontSize = `${Math.random() * 30 + 20}px`;
  heart.style.left = `${Math.random() * window.innerWidth}px`;
  heart.style.bottom = "-50px";
  heart.style.opacity = Math.random() * 0.8 + 0.2;

  heartContainer.appendChild(heart);

  const floatDuration = Math.random() * 3000 + 3000;
  const drift = (Math.random() - 0.5) * 100;
  let start = null;

  function animate(time) {
    if (!start) start = time;
    const progress = time - start;
    const percent = progress / floatDuration;

    if (percent < 1) {
      heart.style.bottom = `${-50 + percent * (window.innerHeight + 50)}px`;
      heart.style.left = `${parseFloat(heart.style.left) + drift * 0.01}px`;
      heart.style.opacity = `${1 - percent}`;
      requestAnimationFrame(animate);
    } else {
      heart.remove();
    }
  }

  requestAnimationFrame(animate);
}

const heartInterval = setInterval(createHeart, 200);
setTimeout(() => clearInterval(heartInterval), 5000);

// =========================
// CLOCKS
// =========================
function setupClock(clockId, startDate) {
  const clockContainer = document.getElementById(clockId);
  const labels = ["Days", "Hours", "Minutes", "Seconds"];
  let currentDisplay = [0, 0, 0, 0];
  let stopStages = [false, false, false, false];
  let scrambling = true;

  function createBlock(value, label) {
    const wrapper = document.createElement("div");
    wrapper.className = "clockBlockWrapper";
    const labelEl = document.createElement("div");
    labelEl.className = "clockLabel";
    labelEl.textContent = label;
    const numberEl = document.createElement("div");
    numberEl.className = "clockBlock";
    numberEl.textContent = value.toString().padStart(2, "0");
    wrapper.appendChild(labelEl);
    wrapper.appendChild(numberEl);
    return wrapper;
  }

  function scrambledValue(i) {
    if (i === 0) return Math.floor(Math.random() * 1000);
    if (i === 1) return Math.floor(Math.random() * 24);
    return Math.floor(Math.random() * 60);
  }

  function animateUnit(i, targetValue, duration = 2000) {
    const startValue = currentDisplay[i];
    let startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      currentDisplay[i] = Math.floor(startValue + (targetValue - startValue) * easeOutQuart(progress));
      renderClock();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        stopStages[i] = true;
      }
    }

    requestAnimationFrame(step);
  }

  function renderClock() {
    clockContainer.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      clockContainer.appendChild(createBlock(currentDisplay[i], labels[i]));
    }
  }

  const intervalId = setInterval(() => {
    const now = new Date();
    const diff = now - startDate;
    const realValues = [
      Math.floor(diff / (1000 * 60 * 60 * 24)),
      Math.floor(diff / (1000 * 60 * 60)) % 24,
      Math.floor(diff / (1000 * 60)) % 60,
      Math.floor(diff / 1000) % 60
    ];

    for (let i = 0; i < 4; i++) {
      if (stopStages[i]) currentDisplay[i] = realValues[i];
      else if (scrambling) currentDisplay[i] = scrambledValue(i);
    }

    renderClock();
  }, 30);

  return {
    stopUnit: (i) => {
      const now = new Date();
      const diff = now - startDate;
      const realValues = [
        Math.floor(diff / (1000 * 60 * 60 * 24)),
        Math.floor(diff / (1000 * 60 * 60)) % 24,
        Math.floor(diff / (1000 * 60)) % 60,
        Math.floor(diff / 1000) % 60
      ];
      animateUnit(i, realValues[i]);
    },
    stopAllScrambling: () => {
      scrambling = false;
    }
  };
}

const metClock = setupClock("metClock", new Date("2024-09-28T00:00:00"));
const loveClock = setupClock("loveClock", new Date("2025-02-07T00:00:00"));

// =========================
// TYPEWRITER + FADE SEQUENTIAL
// =========================
const line1El = document.getElementById("typeLine1");
const line2El = document.getElementById("typeLine2");

function typeWriterFade(el, text, callback) {
  let i = 0;
  el.style.opacity = 1;
  el.textContent = "";

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i++);
      setTimeout(type, 75);
    } else {
      // Wait 1 second before starting fade
      setTimeout(() => {
        el.style.transition = "opacity 1s ease";
        el.style.opacity = 0;

        // Call callback after fade completes (1s)
        if (callback) {
          setTimeout(callback, 1000);
        }
      }, 1000); // 1 second pause before fading
    }
  }

  type();
}


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Sequential typing: line 1 fades, then line 2 types at exact same spot
      typeWriterFade(line1El, "Since the day I met you", () => {
        typeWriterFade(line2El, "I’ve loved you more with every second", () => {
          // Stop clocks after both lines
          setTimeout(() => { loveClock.stopUnit(3); metClock.stopUnit(3); }, 0);
          setTimeout(() => { loveClock.stopUnit(2); metClock.stopUnit(2); }, 1000);
          setTimeout(() => { loveClock.stopUnit(1); metClock.stopUnit(1); }, 2000);
          setTimeout(() => { loveClock.stopUnit(0); metClock.stopUnit(0); }, 3000);
          setTimeout(() => { loveClock.stopAllScrambling(); metClock.stopAllScrambling(); }, 4000);
        });
      });
      observer.disconnect();
    }
  });
}, { threshold: 1 });

observer.observe(line1El);

// =========================
// GALLERY
// =========================
const galleryImages = [
  "images/image2.jpg","images/image3.jpg","images/image4.jpg",
  "images/image5.jpg","images/image6.jpg","images/image7.jpg",
  "images/image8.jpg","images/image9.jpg","images/image10.jpg",
  "images/image11.jpg","images/image12.jpg","images/image13.jpg",
  "images/image14.jpg","images/image15.jpg","images/image16.jpg",
  "images/image17.jpg","images/image18.jpg","images/image19.jpg",
  "images/image20.jpg","images/image21.jpg"
];

let currentIndex = 0;
const galleryImgEl = document.getElementById("currentGalleryImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const galleryHeadingEl = document.getElementById("galleryHeading");

// Set image orientation (horizontal or vertical)
function setOrientation(img) {
  const tempImg = new Image();
  tempImg.src = img.src;
  tempImg.onload = () => {
    if (tempImg.width >= tempImg.height) {
      img.classList.add("horizontal");
      img.classList.remove("vertical");
    } else {
      img.classList.add("vertical");
      img.classList.remove("horizontal");
    }
  };
}

// Show image in gallery
function showImage(index) {
  galleryImgEl.style.opacity = 0; // fade out

  setTimeout(() => {
    galleryImgEl.src = galleryImages[index];
    galleryImgEl.onload = () => {
      setOrientation(galleryImgEl);
      galleryImgEl.style.opacity = 1; // fade in
    };
  }, 100); // slight delay for smooth fade
}

// Initialize first image (no fade)
showImage(currentIndex);

// Arrow navigation
function prevImage() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex);
}

function nextImage() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex);
}

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

// Click arrow buttons
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);

// =========================
// Optional: gallery heading typewriter
// =========================
function typeWriterFadeHeading(el, text) {
  let i = 0;
  el.style.opacity = 1;
  el.textContent = "";

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i++);
      setTimeout(type, 75);
    }
  }
  type();
}

const galleryObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      typeWriterFadeHeading(galleryHeadingEl, "Some of my favorite pictures");
      galleryObserver.disconnect();
    }
  });
}, { threshold: 1 });

galleryObserver.observe(galleryHeadingEl);

