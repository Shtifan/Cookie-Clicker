const socket = io("http://localhost:3000");
const cookie = document.getElementById("cookie");
const counter = document.getElementById("counter");
const playerCount = document.getElementById("playerCount");
const clickPowerBtn = document.getElementById("clickPowerBtn");
const autoClickerBtn = document.getElementById("autoClickerBtn");
const clickPowerCost = document.getElementById("clickPowerCost");
const autoClickerCost = document.getElementById("autoClickerCost");
const clickPowerLevel = document.getElementById("clickPowerLevel");
const autoClickerLevel = document.getElementById("autoClickerLevel");

let gameState = {
    cookies: 0,
    upgrades: {
        clickPower: 1,
        autoClicker: 0,
        autoClickerCost: 100,
        clickPowerCost: 50,
    },
};

// Handle cookie click
cookie.addEventListener("click", () => {
    socket.emit("cookie-clicked");
});

// Handle upgrade purchases
clickPowerBtn.addEventListener("click", () => {
    socket.emit("buy-upgrade", "clickPower");
});

autoClickerBtn.addEventListener("click", () => {
    socket.emit("buy-upgrade", "autoClicker");
});

// Update player count when someone joins or leaves
socket.on("player-count", (count) => {
    playerCount.textContent = count;
});

// Update game state when it changes
socket.on("game-state", (state) => {
    gameState = state;
    updateDisplay();
});

// Update cookie count when it changes
socket.on("cookie-count", (count) => {
    gameState.cookies = count;
    updateDisplay();
});

function updateDisplay() {
    counter.textContent = Math.floor(gameState.cookies);
    clickPowerCost.textContent = gameState.upgrades.clickPowerCost;
    autoClickerCost.textContent = gameState.upgrades.autoClickerCost;
    clickPowerLevel.textContent = gameState.upgrades.clickPower;
    autoClickerLevel.textContent = gameState.upgrades.autoClicker;

    // Update button states
    clickPowerBtn.disabled = gameState.cookies < gameState.upgrades.clickPowerCost;
    autoClickerBtn.disabled = gameState.cookies < gameState.upgrades.autoClickerCost;
}

// Handle initial connection
socket.on("connect", () => {
    console.log("Connected to server");
});
