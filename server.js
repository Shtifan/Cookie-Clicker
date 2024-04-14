const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected");

    // Load initial click count from file
    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading click count file:", err);
            socket.emit("initialClickCount", 0);
        } else {
            const initialClickCount = parseInt(data) || 0;
            socket.emit("initialClickCount", initialClickCount);
        }
    });

    // Handle click event
    socket.on("click", () => {
        fs.readFile("data.txt", "utf8", (err, data) => {
            if (err) {
                console.error("Error reading click count file:", err);
                return;
            }
            let clickCount = parseInt(data) || 0;
            clickCount++;
            fs.writeFile("data.txt", clickCount.toString(), (err) => {
                if (err) {
                    console.error("Error writing click count file:", err);
                } else {
                    // Broadcast updated click count to all clients
                    io.emit("updateClickCount", clickCount);
                }
            });
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
