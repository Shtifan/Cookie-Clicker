const socket = io("http://localhost:3000");
const cookie = document.getElementById("cookie");
const counter = document.getElementById("counter");
const playerCount = document.getElementById("playerCount");

// Handle cookie click
cookie.addEventListener("click", () => {
    socket.emit("cookie-clicked");
});

// Update player count when someone joins or leaves
socket.on("player-count", (count) => {
    playerCount.textContent = count;
});

// Update cookie count when it changes
socket.on("cookie-count", (count) => {
    counter.textContent = count;
});

// Handle initial connection
socket.on("connect", () => {
    console.log("Connected to server");
});
