document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form submission

    const userData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        roles: {
            roleId: document.getElementById("roleId").value,
            roleName: document.getElementById("roleName").value,
        }
    };

    // Make the POST request to the backend API
    fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        alert("User registered successfully!");
        window.location.href = "login.html";
        console.log("Response:", data);

    })
    .catch((error) => {
        console.error("Error:", error);
    });
});


