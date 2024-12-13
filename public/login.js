// let submit = document.querySelector("button");
// submit.addEventListener("click", ()=> {
//   window.location.href = "google.com";
// })

document.getElementById('login').addEventListener('click', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const responseText = await response.text();
    console.log('Response Text:', responseText);

    // Only parse the response if it seems to be JSON
    let result = null;
    try {
      result = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse response as JSON:', error);
      alert('An unexpected error occurred. Please try again.');
      return;
    }

    if (response.ok) {
      const token = result.token || '';  // Assuming token is returned from backend
      sessionStorage.setItem('username', username);
      if (token) localStorage.setItem('token', token);  // Save token securely
      window.location.href = 'main.html';  // Redirect to the main page
    } else {
      alert(result.message);  // Display backend error message
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again.');
  }
});

document.getElementById('signup').addEventListener('click', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please fill out both username and password.');
    return;
  }

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const responseText = await response.text();
    console.log('Response Text:', responseText);

    let result = null;
    try {
      result = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse response as JSON:', error);
      alert('An unexpected error occurred. Please try again.');
      return;
    }

    if (response.ok) {
      alert('Account created successfully! Please log in.');
      window.location.href = 'login.html';  // Redirect to login page after registration
    } else {
      alert(result.message);  // Show backend error
    }
  } catch (error) {
    console.error('Sign up error:', error);
    alert('An error occurred. Please try again.');
  }
});

async function checkSessionOnLoad() {
  try {
    const response = await fetch('/check-session');
    const result = await response.json();

    // If user is logged in, redirect to main.html
    if (result.isLoggedIn) {
      window.location.href = '/main.html';
    }
  } catch (error) {
    console.error('Session check error:', error);
  }
}

