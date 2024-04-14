document.addEventListener("DOMContentLoaded", function () {
    const cookieImg = document.getElementById("cookie-img");
    const clickCountElement = document.getElementById("click-count");
    let clickCount = 0;

    cookieImg.addEventListener("click", function () {
        clickCount++;
        clickCountElement.innerText = clickCount;

        // Send click count to server
        fetch("/update-click-count", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ clickCount: clickCount }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update click count");
                }
                return response.text();
            })
            .then((data) => {
                console.log(data); // Log server response
            })
            .catch((error) => {
                console.error(error);
            });
    });
});
