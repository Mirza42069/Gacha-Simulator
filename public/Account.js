function logout() {
    // Logic to handle logout
    alert("You have been logged out.");
    // Redirect to the login page or home page
    window.location.href = "login.html"; // Change to your login page
}


const accountData = {
    username: "MirzaGamer123",  // Example username
    totalPulls: 128             // Example pull count
};

// Function to display the data
function displayAccountInfo() {
    document.getElementById("username-display").textContent = accountData.username;
    document.getElementById("pulls-display").textContent = accountData.totalPulls;
}

displayAccountInfo();