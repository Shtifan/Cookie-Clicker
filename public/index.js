const socket = io();

document.addEventListener("DOMContentLoaded", function () {
    // Get references to the click count element and the document
    const clickCountElement = document.getElementById("click-count");
    const doc = document.documentElement;

    // Listen for initial click count from server
    socket.on("initialClickCount", (clickCount) => {
        clickCountElement.innerText = clickCount;
    });

    // Listen for click event from server
    socket.on("updateClickCount", (clickCount) => {
        clickCountElement.innerText = clickCount;
    });

    // Add click event listener to the entire document
    doc.addEventListener("click", function () {
        // Send click event to server
        socket.emit("click");
    });

    // Function to animate the cookie
    function animateCookie() {
        const cookieImg = document.getElementById("cookie-img");
        cookieImg.classList.add("cookie-clicked");
        setTimeout(() => {
            cookieImg.classList.remove("cookie-clicked");
        }, 100);
    }

    // Listen for click event on the document and animate the cookie
    doc.addEventListener("click", animateCookie);
});
