// =========================
// Focus Room JavaScript
// =========================

let totalSeconds = 25 * 60; // default 25 minutes
let timer = null;
let points = 0;

// DOM Elements
const timerDisplay = document.getElementById("timerDisplay");
const pointsDisplay = document.getElementById("points");
const room = document.getElementById("room");

// -------------------------
// Timer Functions
// -------------------------
function startTimer(duration = 25 * 60) {
  clearInterval(timer);
  totalSeconds = duration;
  timer = setInterval(updateTimer, 1000);
}

function resetTimer() {
  clearInterval(timer);
  totalSeconds = 25 * 60;
  updateTimerDisplay();
}

function updateTimer() {
  if (totalSeconds <= 0) {
    clearInterval(timer);
    addPoints(10); // session completed
    alert("Session complete! +10 points 🌟");
    totalSeconds = 25 * 60;
    updateTimerDisplay();
    return;
  }
  totalSeconds--;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// -------------------------
// Points and Furniture
// -------------------------
function addPoints(amount) {
  points += amount;
  pointsDisplay.textContent = points;
}

function buyFurniture(cost = 10) {
  if (points >= cost) {
    points -= cost;
    pointsDisplay.textContent = points;
    addFurniture();
  } else {
    alert("Not enough points!");
  }
}

function addFurniture() {
  const furniture = document.createElement("div");
  furniture.className = "furniture";
  furniture.style.left = `${Math.random() * 450}px`; // random horizontal
  room.appendChild(furniture);
}

// -------------------------
// Optional: Custom Session
// -------------------------
function setCustomSession(minutes) {
  startTimer(minutes * 60);
}
