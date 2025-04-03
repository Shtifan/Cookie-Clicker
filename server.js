const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(express.static("./"));

let playerCount = 0;
let totalCookies = 0;

io.on("connection", (socket) => {
    playerCount++;
    io.emit("player-count", playerCount);
    // Send current cookie count to newly connected user
    socket.emit("cookie-count", totalCookies);

    socket.on("cookie-clicked", () => {
        totalCookies++;
        // Broadcast the new total to all connected clients
        io.emit("cookie-count", totalCookies);
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
