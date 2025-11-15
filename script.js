// ----------------- STATE -----------------
var state = {
    points: 0,
    totalStudyTime: 0,
    isStudying: false,
    studyStartTime: null,
    elapsedTime: 0,
    charPos: { x: 7, y: 7 },
    charDir: 'down',
    walkFrame: 0,
    furniture: [],
    keysPressed: {}
};

var TILE_SIZE = 32;
var ROOM_WIDTH = 16;
var ROOM_HEIGHT = 12;

// Shop items
var shopItems = [
    { id: 'clock', name: 'CLOCK', cost: 50, width: 1, height: 1, img: 'clock.png' },
    { id: 'flowers', name: 'PINK FLOWERS', cost: 30, width: 1, height: 1, img: 'PinkFlowers.png' },
    { id: 'bookshelf', name: 'BOOKSHELF', cost: 80, width: 2, height: 2, img: 'bookshelf.png' }
];

// ----------------- CANVAS -----------------
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

// Load background
let background = new Image();
background.src = 'background.piskel';

// Load character
let character = new Image();
character.src = 'assets/player.png'; // this will be your simple pixel character

// Load shop images dynamically
shopItems.forEach(item => {
    item.image = new Image();
    item.image.src = 'assets/' + item.img;
});

// ----------------- SHOP -----------------
function initShop() {
    var grid = document.getElementById('shopGrid');
    var html = '';
    shopItems.forEach(item => {
        var canAfford = state.points >= item.cost;
        html += `<div class="shop-item">
                    <div class="shop-item-name">${item.name}</div>
                    <img src="assets/${item.img}" width="64" height="64">
                    <div class="shop-item-cost">${item.cost} COINS</div>
                    <button class="buy-btn ${canAfford ? 'available' : 'unavailable'}" onclick="buyItem('${item.id}')" id="buy-${item.id}">
                        ${canAfford ? 'BUY' : 'NOT ENOUGH'}
                    </button>
                 </div>`;
    });
    grid.innerHTML = html;
}

function updateShopButtons() {
    shopItems.forEach(item => {
        var btn = document.getElementById('buy-' + item.id);
        if (btn) {
            var canAfford = state.points >= item.cost;
            btn.className = 'buy-btn ' + (canAfford ? 'available' : 'unavailable');
            btn.textContent = canAfford ? 'BUY' : 'NOT ENOUGH';
        }
    });
}

function toggleShop() {
    var modal = document.getElementById('shopModal');
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else {
        modal.classList.add('active');
        initShop();
    }
}

function buyItem(itemId) {
    let item = shopItems.find(i => i.id === itemId);
    if (item && state.points >= item.cost) {
        state.points -= item.cost;
        state.furniture.push({
            ...item,
            x: 2 + (state.furniture.length % 5) * 2,
            y: 2 + Math.floor(state.furniture.length / 5) * 2
        });
        updateDisplay();
        updateShopButtons();
    }
}

// ----------------- STUDY -----------------
function toggleStudy() {
    if (state.isStudying) endStudy();
    else startStudy();
}

function startStudy() {
    state.isStudying = true;
    state.studyStartTime = Date.now();
    state.elapsedTime = 0;
    var btn = document.getElementById('studyBtn');
    btn.textContent = 'END';
    btn.className = 'study-btn stop-btn';
    document.getElementById('timerInfo').textContent = '+10 COINS/MIN';
}

function endStudy() {
    if (state.studyStartTime) {
        var minutes = Math.floor(state.elapsedTime / 60000);
        var earned = minutes * 10;
        state.points += earned;
        state.totalStudyTime += minutes;
        state.isStudying = false;
        state.studyStartTime = null;
        state.elapsedTime = 0;
        var btn = document.getElementById('studyBtn');
        btn.textContent = 'START';
        btn.className = 'study-btn start-btn';
        document.getElementById('timerInfo').textContent = 'START TO EARN COINS';
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('pointsDisplay').textContent = state.points + ' COINS';
    document.getElementById('totalTimeDisplay').textContent = state.totalStudyTime + 'm STUDIED';
}

function formatTime(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// ----------------- GAME LOOP -----------------
function gameLoop() {
    if (state.isStudying && state.studyStartTime) {
        state.elapsedTime = Date.now() - state.studyStartTime;
        document.getElementById('timerDisplay').textContent = formatTime(state.elapsedTime);
    }
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (background.complete) ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw furniture
    state.furniture.forEach(item => {
        if (item.image.complete) ctx.drawImage(item.image, item.x * TILE_SIZE, item.y * TILE_SIZE, item.width * TILE_SIZE, item.height * TILE_SIZE);
    });

    // Draw character
    if (character.complete) ctx.drawImage(character, state.charPos.x * TILE_SIZE, state.charPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// ----------------- MOVEMENT -----------------
document.addEventListener('keydown', e => state.keysPressed[e.key] = true);
document.addEventListener('keyup', e => state.keysPressed[e.key] = false);

setInterval(() => {
    let moved = false;
    let {x, y} = state.charPos;
    if (state.keysPressed['ArrowUp'] || state.keysPressed['w']) { y = Math.max(0, y - 1); moved = true; state.charDir='up'; }
    if (state.keysPressed['ArrowDown'] || state.keysPressed['s']) { y = Math.min(ROOM_HEIGHT-1, y + 1); moved = true; state.charDir='down'; }
    if (state.keysPressed['ArrowLeft'] || state.keysPressed['a']) { x = Math.max(0, x - 1); moved = true; state.charDir='left'; }
    if (state.keysPressed['ArrowRight'] || state.keysPressed['d']) { x = Math.min(ROOM_WIDTH-1, x + 1); moved = true; state.charDir='right'; }
    if (moved) state.charPos = {x, y};
}, 100);

// ----------------- INIT -----------------
updateDisplay();
gameLoop();
