const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const fs = require("fs");
const path = require("path");

app.use(express.static("./"));

let playerCount = 0;
let totalCookies = 0;
let upgrades = {
    clickPower: 1,
    autoClicker: 0,
    autoClickerCost: 100,
    clickPowerCost: 50,
};

// Load game state from file
const gameStateFile = path.join(__dirname, "cookies.txt");
try {
    if (fs.existsSync(gameStateFile)) {
        const data = JSON.parse(fs.readFileSync(gameStateFile, "utf8"));
        totalCookies = data.cookies || 0;
        upgrades = data.upgrades || upgrades;
        console.log(`Loaded game state from file`);
    }
} catch (err) {
    console.error("Error loading game state:", err);
}

// Function to save game state
const saveGameState = () => {
    try {
        const gameState = {
            cookies: totalCookies,
            upgrades: upgrades,
        };
        fs.writeFileSync(gameStateFile, JSON.stringify(gameState));
        console.log(`Saved game state to file`);
    } catch (err) {
        console.error("Error saving game state:", err);
    }
};

io.on("connection", (socket) => {
    playerCount++;
    io.emit("player-count", playerCount);
    // Send current game state to newly connected user
    socket.emit("game-state", { cookies: totalCookies, upgrades: upgrades });

    socket.on("cookie-clicked", () => {
        totalCookies += upgrades.clickPower;
        // Broadcast the new total to all connected clients
        io.emit("cookie-count", totalCookies);
        // Save the new state to file
        saveGameState();
    });

    socket.on("buy-upgrade", (type) => {
        let canBuy = false;
        if (type === "clickPower" && totalCookies >= upgrades.clickPowerCost) {
            totalCookies -= upgrades.clickPowerCost;
            upgrades.clickPower *= 2;
            upgrades.clickPowerCost *= 2;
            canBuy = true;
        } else if (type === "autoClicker" && totalCookies >= upgrades.autoClickerCost) {
            totalCookies -= upgrades.autoClickerCost;
            upgrades.autoClicker++;
            upgrades.autoClickerCost = Math.floor(upgrades.autoClickerCost * 1.5);
            canBuy = true;
        }

        if (canBuy) {
            io.emit("game-state", { cookies: totalCookies, upgrades: upgrades });
            saveGameState();
        }
    });

    socket.on("disconnect", () => {
        playerCount--;
        io.emit("player-count", playerCount);
    });
});

// Auto-clicker logic
setInterval(() => {
    if (upgrades.autoClicker > 0) {
        totalCookies += upgrades.autoClicker * upgrades.clickPower;
        io.emit("cookie-count", totalCookies);
        saveGameState();
    }
}, 1000);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
