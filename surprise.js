// surprise.js

// Create a container for hearts
const heartContainer = document.createElement("div");
heartContainer.style.position = "fixed";
heartContainer.style.top = 0;
heartContainer.style.left = 0;
heartContainer.style.width = "100%";
heartContainer.style.height = "100%";
heartContainer.style.pointerEvents = "none"; // hearts won't block clicks
heartContainer.style.overflow = "hidden";
document.body.appendChild(heartContainer);

function createHeart() {
    const heart = document.createElement("div");
    heart.textContent = "❤"; // heart character
    heart.style.position = "absolute";
    heart.style.color = "#ff6b81";
    heart.style.fontSize = `${Math.random() * 30 + 20}px`; // 20px to 50px
    heart.style.left = `${Math.random() * window.innerWidth}px`;
    heart.style.bottom = "-50px";
    heart.style.opacity = Math.random() * 0.8 + 0.2; // semi-transparent

    heartContainer.appendChild(heart);

    // Animate upward
    const floatDuration = Math.random() * 3000 + 3000; // 3s to 6s
    const drift = (Math.random() - 0.5) * 100; // left/right drift
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

// Spawn hearts continuously for 5 seconds
const heartInterval = setInterval(createHeart, 200);

setTimeout(() => {
    clearInterval(heartInterval);
}, 5000);