// Function to get the logged-in username from localStorage and display it
function displayUsername() {
    const username = sessionStorage.getItem("username");
  
    if (username) {
      document.getElementById("username-display").textContent = username;
    } else {
      // If no username is found, redirect to login page
      window.location.href = "login.html";
    }
  }
  
  // Function to log the user out
  function logout() {
    sessionStorage.removeItem("username"); // Clear stored username
    window.location.href = "login.html"; // Redirect to login page
    localStorage.removeItem('totalPulls');
    localStorage.removeItem('raritycount');
  }

  async function getPullHistory(){

  }
  
  // Call displayUsername when the page loads
  document.addEventListener("DOMContentLoaded", displayUsername);
  document.addEventListener('DOMContentLoaded', () => {
   
    const username = sessionStorage.getItem('username') || 'Guest';
    document.getElementById('username-display').textContent = username;

    // Get the total pulls from localStorage and display it
    const totalPulls = localStorage.getItem('totalPulls') || '0';
    document.getElementById('pulls-display').textContent = totalPulls;
});

  
  