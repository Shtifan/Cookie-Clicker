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

// Load cookie count from file
const cookieFile = path.join(__dirname, "cookies.dat");
try {
    if (fs.existsSync(cookieFile)) {
        const data = fs.readFileSync(cookieFile, "utf8");
        totalCookies = parseInt(data) || 0;
        console.log(`Loaded ${totalCookies} cookies from file`);
    }
} catch (err) {
    console.error("Error loading cookie count:", err);
}

// Function to save cookie count
const saveCookieCount = () => {
    try {
        fs.writeFileSync(cookieFile, totalCookies.toString());
        console.log(`Saved ${totalCookies} cookies to file`);
    } catch (err) {
        console.error("Error saving cookie count:", err);
    }
};

io.on("connection", (socket) => {
    playerCount++;
    io.emit("player-count", playerCount);
    // Send current cookie count to newly connected user
    socket.emit("cookie-count", totalCookies);

    socket.on("cookie-clicked", () => {
        totalCookies++;
        // Broadcast the new total to all connected clients
        io.emit("cookie-count", totalCookies);
        // Save the new count to file
        saveCookieCount();
    });

    socket.on("disconnect", () => {
        playerCount--;
        io.emit("player-count", playerCount);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
