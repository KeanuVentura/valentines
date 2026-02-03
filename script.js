const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const title = document.querySelector("h1");

let hoverCount = 0;
let yesScale = 1;
let noIsClickable = false;
let noClickCount = 0;
let growStageStarted = false;

const noMessages = [
  "you must've clicked no by accident",
  "are you sure?",
  "yes looks very tempting",
  "wow that yes button looks very big and fun to click",
  "fine, you can click no"
];

let noStartX, noStartY;

window.addEventListener("load", () => {
  response.style.minHeight = "24px";

  const yesRect = yesBtn.getBoundingClientRect();
  noStartX = yesRect.right + 30;
  noStartY = yesRect.top;

  noBtn.style.left = `${noStartX}px`;
  noBtn.style.top = `${noStartY}px`;
});

function resetNoButton() {
  noBtn.style.left = `${noStartX}px`;
  noBtn.style.top = `${noStartY}px`;
}

function isOverlapping(r1, r2) {
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
}

noBtn.addEventListener("mouseover", () => {
  if (noIsClickable) return;

  hoverCount++;

  if (hoverCount === 5) {
    resetNoButton();
    noIsClickable = true;
    response.innerHTML = "Playing hard to get i see 😏";
    return;
  }

  const yesRect = yesBtn.getBoundingClientRect();
  const maxX = window.innerWidth - noBtn.offsetWidth;
  const maxY = window.innerHeight - noBtn.offsetHeight;

  let x, y, noRect, attempts = 0;

  do {
    x = Math.random() * maxX;
    y = Math.random() * maxY;

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    noRect = noBtn.getBoundingClientRect();
    attempts++;
  } while (isOverlapping(noRect, yesRect) && attempts < 30);
});

noBtn.addEventListener("click", () => {
  if (!noIsClickable) return;

  if (noClickCount === 4) {
    yesBtn.style.visibility = "hidden";
    title.style.display = "none";

    const centerX = window.innerWidth / 2 - noBtn.offsetWidth / 2;
    const centerY = window.innerHeight / 2 - noBtn.offsetHeight / 2;
    noBtn.style.left = `${centerX}px`;
    noBtn.style.top = `${centerY}px`;

    response.innerHTML = noMessages[noClickCount];
    noClickCount++;
    return;
  }

  if (noClickCount < 5) {
    response.innerHTML = noMessages[noClickCount];

    yesScale += 0.1;
    yesBtn.style.transform = `scale(${yesScale})`;

    noClickCount++;
    return;
  }

  if (!growStageStarted) {
    response.innerHTML = "you really thought i'd make it that easy for you";
    growStageStarted = true;
  } else if (growStageStarted && response.innerHTML !== "") {
    response.innerHTML = "";
  }

  let currentScale = noBtn.dataset.scale
    ? parseFloat(noBtn.dataset.scale)
    : 1;

  currentScale += 0.4;
  noBtn.dataset.scale = currentScale;

  if (noClickCount < 25) {
    noBtn.style.setProperty("--scale", currentScale);
    noBtn.classList.remove("shake");
    void noBtn.offsetWidth;
    noBtn.classList.add("shake");
  } else if (noClickCount === 25) {
    noBtn.textContent = "YES";
    noBtn.style.backgroundColor = "#2ecc71";
    noBtn.style.color = "white";
    noBtn.style.transform = `scale(${currentScale})`;
    noBtn.classList.remove("shake");
  
    // Add YES click effects to the NO->YES button
    noBtn.addEventListener("click", () => {
      response.innerHTML = "YAY!! 💖💖 I love you so much!";
      noBtn.style.transform = "scale(0.9)";
      noBtn.style.filter = "brightness(0.8)";
      setTimeout(() => {
        noBtn.style.transform = "scale(1)";
        noBtn.style.filter = "brightness(1)";
      }, 100);
    }, { once: true }); // only trigger once
  }

  noClickCount++;
});

yesBtn.addEventListener("click", () => {
    response.innerHTML = "YAY!! 💖💖 I love you so much!";
  
    yesBtn.style.setProperty("--scale", 1); // initial scale for pop
    yesBtn.classList.remove("pop");
    void yesBtn.offsetWidth; 
    yesBtn.classList.add("pop");
  });

yesBtn.addEventListener("mousedown", () => {
  yesBtn.style.transform = "scale(0.9)";
  yesBtn.style.filter = "brightness(0.8)";
});

yesBtn.addEventListener("mouseup", () => {
  yesBtn.style.transform = "scale(1)";
  yesBtn.style.filter = "brightness(1)";
});
