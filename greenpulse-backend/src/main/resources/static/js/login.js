// Login form submission
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            // Read the response as JSON
            const data = await response.json(); // Corrected: Read JSON instead of text
            const token = data.token; // Extract token
            const role = data.role; // Extract role

            // Store in localStorage
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("userRole", role);

            alert("Login successful!");

            // Redirect based on role
            if (role === "ROLE_ADMIN") {
                window.location.href = "admin.html";
            } else if (role === "ROLE_USER") {
                window.location.href = "user.html";
            } else {
                alert("Unknown role! Redirecting to default dashboard.");
                window.location.href = "dashboard.html";
            }

        } else {
            const errorMessage = await response.text();
            document.getElementById("errorMessage").textContent = errorMessage;
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("errorMessage").textContent = "An error occurred. Please try again.";
    }
});

// Register button event listener
document.getElementById("regButton").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "register.html";
});