let totalSeconds = 0;
let timer = null;

let points = parseInt(localStorage.getItem("points")) || 0;
let furnitureList = JSON.parse(localStorage.getItem("furnitureList")) || [];

const timerDisplay = document.getElementById("timerDisplay");
const pointsDisplay = document.getElementById("points");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

const buyBtn = document.getElementById("buyBtn");
const furnitureMenu = document.getElementById("furnitureMenu");
const room = document.getElementById("room");

pointsDisplay.textContent = points;

/* TIMER SYSTEM */
function updateTimer() {
    totalSeconds++;
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    timerDisplay.textContent = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

startBtn.onclick = () => {
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
};

stopBtn.onclick = () => clearInterval(timer);

resetBtn.onclick = () => {
    clearInterval(timer);
    totalSeconds = 0;
    timerDisplay.textContent = "00:00";
};

/* OPEN SHOP */
buyBtn.onclick = () => {
    furnitureMenu.style.display = furnitureMenu.style.display === "none" ? "flex" : "none";
};

/* BUYING ITEMS */
furnitureMenu.querySelectorAll("img").forEach(item => {
    item.addEventListener("click", () => {
        const cost = parseInt(item.dataset.cost);

        if (points < cost) {
            alert("Not enough points!");
            return;
        }

        points -= cost;
        pointsDisplay.textContent = points;

        const f = document.createElement("img");
        f.src = item.src;
        f.classList.add("furniture");
        f.style.left = "150px";
        f.style.top = "150px";

        f.dataset.type = item.dataset.type;  

        room.appendChild(f);

        furnitureList.push({
            src: item.src,
            type: item.dataset.type,           
            x: 150,
            y: 150
        });

        enableDrag(f);
        saveState();
    });
});

/* DRAGGING */
let dragged = null;
let offsetX = 0;
let offsetY = 0;

function enableDrag(el) {
    el.addEventListener("mousedown", e => {
        dragged = el;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });
}

document.addEventListener("mousemove", e => {
    if (!dragged) return;

    dragged.style.left = (e.clientX - offsetX) + "px";
    dragged.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    if (!dragged) return;

    const index = furnitureList.findIndex(
        f => f.src === dragged.src && f.x === parseInt(dragged.style.left) && f.y === parseInt(dragged.style.top)
    );

    // If item found, update its saved coordinates
    if (index !== -1) {
        furnitureList[index].x = parseInt(dragged.style.left);
        furnitureList[index].y = parseInt(dragged.style.top);
    }

    saveState();
    dragged = null;
});

/* SAVE STATE */
function saveState() {
    localStorage.setItem("points", points);
    localStorage.setItem("furnitureList", JSON.stringify(furnitureList));
}

/* LOAD FURNITURE */
furnitureList.forEach(f => {
    const el = document.createElement("img");
    el.src = f.src;
    el.classList.add("furniture");
    el.style.left = f.x + "px";
    el.style.top = f.y + "px";

    el.dataset.type = f.type;   

    room.appendChild(el);
    enableDrag(el);
});



