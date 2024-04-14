const socket = io();

document.addEventListener("DOMContentLoaded", function () {
    const socket = io();

    // Get references to the image and click count elements
    const cookieImg = document.getElementById("cookie-img");
    const clickCountElement = document.getElementById("click-count");

    // Listen for initial click count from server
    socket.on("initialClickCount", (clickCount) => {
        clickCountElement.innerText = clickCount;
    });

    // Listen for click event from server
    socket.on("updateClickCount", (clickCount) => {
        clickCountElement.innerText = clickCount;
    });

    // Add click event listener to the image
    cookieImg.addEventListener("click", function () {
        // Send click event to server
        socket.emit("click");
    });
});
