const express = require("express");
const http = require("http");
const fs = require("fs");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static("public"));

// Serve index.html from the root path
app.get("/", (req, res) => {
    res.sendFile("./public");
});

// Function to read the click count from data.txt
function readClickCount(callback) {
    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading data.txt:", err);
            return;
        }
        const clickCount = parseInt(data.trim());
        callback(clickCount);
    });
}

// Function to write the click count to data.txt
function writeClickCount(clickCount) {
    fs.writeFile("data.txt", clickCount.toString(), (err) => {
        if (err) {
            console.error("Error writing data.txt:", err);
            return;
        }
        console.log("Click count updated in data.txt");
    });
}

// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle cookie click event
    socket.on("cookieClick", () => {
        // Read the current click count
        readClickCount((clickCount) => {
            // Increment the click count
            clickCount++;

            // Write the updated click count back to data.txt
            writeClickCount(clickCount);

            // Broadcast the click count to all connected clients
            io.emit("cookieClick", clickCount);
        });
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
