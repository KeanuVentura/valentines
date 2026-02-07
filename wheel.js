const wheelCanvas = document.getElementById("dateWheel");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("wheelResult");
const popup = document.getElementById("popupOutcome");

const dates = [
  "Julians + Hike + Cabin",
  "Museum of Contemporary Art",
  "Joshua Tree Camping Trip",
  "Poke + Sunset Cliffs",
  "Balboa Park Botanical Garden",
  "Rooftop Cinema",
  "Farmers Market",
  "Picnic at Kate Sessions Park"
];

const colors = [
  "#228B22", "#FF6B6B", "#FFA94D", "#FFD93D",
  "#4D96FF", "#6C5B7B", "#00C49A", "#FF6F91"
];

const canvasSize = 600;
const dpr = window.devicePixelRatio || 1;
wheelCanvas.width = canvasSize * dpr;
wheelCanvas.height = canvasSize * dpr;
wheelCanvas.style.width = canvasSize + "px";
wheelCanvas.style.height = canvasSize + "px";
ctx.scale(dpr, dpr);

const wheelRadius = canvasSize / 2;
const sliceAngle = 2 * Math.PI / dates.length;
let rotation = 0;
let spinning = false;
let hoverIndex = null;

const tooltip = document.createElement("div");
tooltip.style.position = "fixed";
tooltip.style.top = "50%";
tooltip.style.left = "50%";
tooltip.style.transform = "translate(-50%, -50%)";
tooltip.style.padding = "12px 20px";
tooltip.style.background = "rgba(0,0,0,0.7)";
tooltip.style.color = "white";
tooltip.style.font = "bold 20px Tahoma";
tooltip.style.borderRadius = "10px";
tooltip.style.border = "2px solid white";
tooltip.style.pointerEvents = "none";
tooltip.style.display = "none";
tooltip.style.textAlign = "center";
tooltip.style.zIndex = 1000;
document.body.appendChild(tooltip);

function drawWheel() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.save();
  ctx.translate(wheelRadius, wheelRadius);

  for (let i = 0; i < dates.length; i++) {
    const start = sliceAngle * i + rotation;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, wheelRadius, start, end);

    ctx.fillStyle = (!spinning && hoverIndex === i) ? "#FFC0CB" : colors[i];
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 17px Tahoma";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.fillText(dates[i], wheelRadius - 10, 5);
    ctx.restore();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(canvasSize/2, 40);
  ctx.lineTo(canvasSize/2 - 15, 2);
  ctx.lineTo(canvasSize/2 + 15, 2);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();
}

drawWheel();

wheelCanvas.addEventListener("mousemove", (e) => {
  if (spinning) return;

  const rect = wheelCanvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvasSize / rect.width) - wheelRadius;
  const y = (e.clientY - rect.top) * (canvasSize / rect.height) - wheelRadius;
  const distance = Math.sqrt(x*x + y*y);

  if (distance <= wheelRadius) {
    let angle = Math.atan2(y, x);
    if (angle < 0) angle += 2 * Math.PI;
    hoverIndex = Math.floor((angle - rotation + 2*Math.PI) % (2*Math.PI) / sliceAngle);
    tooltip.style.display = "block";
    tooltip.textContent = dates[hoverIndex];
  } else {
    hoverIndex = null;
    tooltip.style.display = "none";
  }
  drawWheel();
});

wheelCanvas.addEventListener("mouseleave", () => {
  hoverIndex = null;
  tooltip.style.display = "none";
  drawWheel();
});

spinBtn.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;

  spinBtn.style.display = "none";
  tooltip.style.display = "none";
  resultEl.textContent = "";

  const spins = 5;
  const targetIndex = 0;
  const targetAngle = - (Math.PI/2 - targetIndex * sliceAngle - sliceAngle/2);
  const totalRotation = spins * 4 * Math.PI + targetAngle - 0.7;
  const duration = 10000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    rotation = eased * totalRotation;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      popup.classList.add("show");
      startConfetti(10000);
    }
  }

  requestAnimationFrame(animate);
});

popup.addEventListener("click", () => {
  popup.classList.remove("show");
});

const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiParticles = [];
const confettiCount = 150;
let confettiActive = false;

function createConfetti() {
  confettiParticles = [];
  for (let i = 0; i < confettiCount; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }
}

function drawConfetti() {
  if (!confettiActive) return;

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles.forEach((p, i) => {
    confettiCtx.beginPath();
    confettiCtx.lineWidth = p.r / 2;
    confettiCtx.strokeStyle = p.color;
    confettiCtx.moveTo(p.x + p.tilt + p.r / 4, p.y);
    confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
    confettiCtx.stroke();

    p.tiltAngle += p.tiltAngleIncremental;
    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
    p.tilt = Math.sin(p.tiltAngle) * 15;

    if (p.y > confettiCanvas.height) {
      p.y = -10;
      p.x = Math.random() * confettiCanvas.width;
    }
  });

  requestAnimationFrame(drawConfetti);
}

function startConfetti(duration = 3000) {
  createConfetti();
  confettiActive = true;
  drawConfetti();
  setTimeout(() => { confettiActive = false; confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); }, duration);
}

spinBtn.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;

  spinBtn.style.display = "none";
  tooltip.style.display = "none";

  const spins = 5;
  const targetIndex = 0;
  const targetAngle = - (Math.PI/2 - targetIndex * sliceAngle - sliceAngle/2);
  const totalRotation = spins * 4 * Math.PI + targetAngle - 0.7;
  const duration = 8000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    rotation = eased * totalRotation;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      popup.classList.add("show");
      startConfetti(3000);
    }
  }

  requestAnimationFrame(animate);
});
