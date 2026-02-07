const music = new Audio("song.mp3");
music.loop = true;
music.currentTime = 0;

document.body.addEventListener("click", () => {
  music.play().catch(() => {});
}, { once: true });

const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const title = document.querySelector("h1");
const buttons = document.querySelector(".buttons");

let gameActive = true;
let noClickCount = 0;
let noCanBeClicked = false;
let bossPhase = false;
let noSize = 1;
let firstBossClick = true;

const noMessages = [
  "you must've clicked no by accident",
  "please?",
  "the yes looks very tempting",
  "wow that yes button looks fun to click",
  "fine, you can click no",
  "fine, you can click no"
];

function positionNoInitially() {
  const yesRect = yesBtn.getBoundingClientRect();
  noBtn.style.left = `${yesRect.right + 30}px`;
  noBtn.style.top = `${yesRect.top}px`;
}

function moveNoButton() {
  if (!gameActive || noCanBeClicked || bossPhase) return;

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
  } while (
    !(
      noRect.right < yesRect.left ||
      noRect.left > yesRect.right ||
      noRect.bottom < yesRect.top ||
      noRect.top > yesRect.bottom
    ) &&
    attempts < 50
  );
}

function animateYes(effect) {
  yesBtn.classList.remove("heartbeat", "shake");
  void yesBtn.offsetWidth;
  yesBtn.classList.add(effect);
}

function centerNoButtonSmooth() {
  buttons.removeChild(noBtn);
  document.body.appendChild(noBtn);

  const rect = noBtn.getBoundingClientRect();
  
  noBtn.style.position = "fixed";
  noBtn.style.left = `${rect.left}px`;
  noBtn.style.top = `${rect.top}px`;

  void noBtn.offsetWidth;

  const targetX = window.innerWidth / 2 - noBtn.offsetWidth / 2 - 20;
  const targetY = window.innerHeight / 2;

  noBtn.style.transition = "left 0.5s ease, top 0.5s ease";
  noBtn.style.left = `${targetX}px`;
  noBtn.style.top = `${targetY}px`;

  const messageOffset = noBtn.offsetHeight + 20;
  response.style.position = "fixed";
  response.style.left = `${window.innerWidth / 2}px`;
  response.style.top = `${targetY + messageOffset}px`;
  response.style.transform = "translateX(-50%)";
}

window.addEventListener("load", positionNoInitially);

noBtn.addEventListener("mouseenter", moveNoButton);

noBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!noCanBeClicked) {
    response.textContent = noMessages[noClickCount];

    if (noClickCount % 2 === 0) {
      animateYes("heartbeat");
    } else {
      animateYes("shake");
    }

    noClickCount++;

    if (noClickCount >= noMessages.length) {
      noCanBeClicked = true;
      bossPhase = true;

      response.textContent = "but you're going to have to work for it";
      title.textContent = "";
      yesBtn.style.display = "none";
      centerNoButtonSmooth();
    }

    moveNoButton();
    return;
  }

  if (bossPhase && firstBossClick) {
    response.textContent = "";
    firstBossClick = false;
  }

  if (bossPhase && noClickCount < 40) { 
    noSize += 0.2;
    noBtn.style.transform = `scale(${noSize})`;
    noClickCount++;

    if (noClickCount === 40) {
        noBtn.textContent = "YES";
        noBtn.style.backgroundColor = "#2ecc71";
        noBtn.style.color = "white";

        noBtn.style.transition = "transform 0.1s ease, filter 0.1s ease";
        noBtn.style.transform = `scale(${noSize * 0.9})`;
        noBtn.style.filter = "brightness(0.8)";
        setTimeout(() => {
            noBtn.style.transform = `scale(${noSize})`;
            noBtn.style.filter = "brightness(1)";
        }, 100);

        setTimeout(() => {
            const heheText = document.createElement("p");
            heheText.textContent = "hehe";
            heheText.style.position = "fixed";
            heheText.style.bottom = "20px";
            heheText.style.left = "50%";
            heheText.style.transform = "translateX(-50%)";
            heheText.style.fontSize = "2rem";
            heheText.style.color = "white";
            heheText.style.fontFamily = "'Tahoma', Geneva, sans-serif";
            document.body.appendChild(heheText);

            setTimeout(() => {
              localStorage.setItem("carryMusicTime", music.currentTime);
              window.location.href = "surprise.html";
            }, 1000);
        }, 1000);
    }
  }
});

yesBtn.addEventListener("click", () => {
  gameActive = false;

  noBtn.style.position = "static";
  yesBtn.style.position = "static";

  buttons.style.display = "flex";
  buttons.style.justifyContent = "center";
  buttons.style.gap = "30px";

  title.textContent = "Are you sure?";
  response.textContent = "";

  yesBtn.classList.remove("pop");
  void yesBtn.offsetWidth;
  yesBtn.classList.add("pop");
});
