 let totalSeconds = 25 * 60;
let timer = null;
let points = parseInt(localStorage.getItem("points")) || 0;
let furnitureList = JSON.parse(localStorage.getItem("furnitureList")) || [];

const timerDisplay = document.getElementById("timerDisplay");
const pointsDisplay = document.getElementById("points");
const room = document.getElementById("room");
const character = document.getElementById("character");
const buyBtn = document.getElementById("buyBtn");
const furnitureMenu = document.getElementById("furnitureMenu");
const resetTimerBtn = document.getElementById("resetTimerBtn");

pointsDisplay.textContent = points;

// -------------------------
// Timer Functions
// -------------------------
function startTimer(duration = 25 * 60) {
    clearInterval(timer);
    totalSeconds = duration;
    updateTimerDisplay();
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (totalSeconds <= 0) {
        clearInterval(timer);
        addPoints(10);
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
    timerDisplay.textContent =
        `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// Reset timer
resetTimerBtn.addEventListener("click", () => {
    startTimer(25 * 60);
});

// -------------------------
// Points
// -------------------------
function addPoints(amount) {
    points += amount;
    pointsDisplay.textContent = points;
    saveState();
}

character.addEventListener("click", () => {
    addPoints(1);
});

// -------------------------
// Furniture Buying
// -------------------------
buyBtn.addEventListener("click", () => {
    furnitureMenu.style.display = furnitureMenu.style.display === "none" ? "flex" : "none";
});

furnitureMenu.querySelectorAll("img").forEach(item => {
    item.addEventListener("click", () => {
        const cost = parseInt(item.dataset.cost);
        const type = item.dataset.type;

        if (points < cost) {
            alert("Not enough points!");
            return;
        }

        points -= cost;
        pointsDisplay.textContent = points;

        const f = document.createElement("img");
        f.src = item.src;
        f.className = "furniture";
        f.style.left = "100px";
        f.style.top = "100px";
        f.dataset.type = type;
        room.appendChild(f);

        furnitureList.push({ type, x: 100, y: 100, src: item.src });
        saveState();
        enableDrag(f);
    });
});

// -------------------------
// Drag & Drop
// -------------------------
let draggedFurniture = null;
let offsetX = 0;
let offsetY = 0;

function enableDrag(el) {
    el.addEventListener("mousedown", (e) => {
        draggedFurniture = el;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        el.style.cursor = "grabbing";
    });
}

document.addEventListener("mousemove", (e) => {
    if (draggedFurniture) {
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        x = Math.max(0, Math.min(window.innerWidth - draggedFurniture.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - draggedFurniture.offsetHeight, y));

        draggedFurniture.style.left = x + "px";
        draggedFurniture.style.top = y + "px";
    }
});

document.addEventListener("mouseup", () => {
    if (draggedFurniture) {
        const index = furnitureList.findIndex(f => f.src === draggedFurniture.src && f.type === draggedFurniture.dataset.type);
        if (index !== -1) {
            furnitureList[index].x = parseInt(draggedFurniture.style.left);
            furnitureList[index].y = parseInt(draggedFurniture.style.top);
        }
        saveState();
        draggedFurniture.style.cursor = "grab";
        draggedFurniture = null;
    }
});

// -------------------------
// Save & Load
// -------------------------
function saveState() {
    localStorage.setItem("points", points);
    localStorage.setItem("furnitureList", JSON.stringify(furnitureList));
}

// Load saved furniture
furnitureList.forEach(f => {
    const el = document.createElement("img");
    el.src = f.src;
    el.className = "furniture";
    el.style.left = f.x + "px";
    el.style.top = f.y + "px";
    el.dataset.type = f.type;
    room.appendChild(el);
    enableDrag(el);
});

// Start timer automatically
startTimer();

