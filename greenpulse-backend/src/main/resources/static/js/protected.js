document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("You are not logged in!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/protected-endpoint", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.body.innerHTML += `<h2>Protected Data:</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
        } else if (response.status === 401) {
            alert("Unauthorized! Please log in again.");
            localStorage.removeItem("jwtToken");
            window.location.href = "login.html";
        } else {
            alert("Failed to load protected data.");
        }
    } catch (error) {
        console.error("Error fetching protected data:", error);
    }
});
