// HEARTS (existing)
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
            heartContainer.removeChild(heart);
        }
    }

    requestAnimationFrame(animate);
}

const heartInterval = setInterval(createHeart, 200);
setTimeout(() => clearInterval(heartInterval), 5000);

// CLOCKS
function setupClock(clockId, startDate) {
  const clockContainer = document.getElementById(clockId);
  const labels = ["Days", "Hours", "Minutes", "Seconds"];

  function createBlock(number, label) {
    const wrapper = document.createElement("div");
    wrapper.className = "clockBlockWrapper";

    const labelEl = document.createElement("div");
    labelEl.className = "clockLabel";
    labelEl.textContent = label;

    const numberEl = document.createElement("div");
    numberEl.className = "clockBlock";
    numberEl.textContent = number.toString().padStart(2, '0');

    wrapper.appendChild(labelEl);
    wrapper.appendChild(numberEl);

    return wrapper;
  }

  function updateClock() {
    const now = new Date();
    let diff = now - startDate;

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const numbers = [days, hours, minutes, seconds];

    clockContainer.innerHTML = "";
    for (let i = 0; i < numbers.length; i++) {
      clockContainer.appendChild(createBlock(numbers[i], labels[i]));
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// Initialize clocks
setupClock("metClock", new Date("2024-09-28T00:00:00"));
setupClock("loveClock", new Date("2025-02-07T00:00:00"));