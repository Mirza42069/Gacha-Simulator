// let submit = document.querySelector("button");
// submit.addEventListener("click", ()=> {
//   window.location.href = "google.com";
// })

sessionStorage.setItem('username', username);

document.getElementById('login').addEventListener('click', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {  // Adjust '/login' to your actual server route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
      // Save user info to local storage or session storage
      sessionStorage.setItem('username', username);

      // Redirect to main.html
      window.location.href = 'main.html';
    } else {
      // Display error message if login fails
      alert(result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again.');
  }
});

document.getElementById('signup').addEventListener('click', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  try {
      const response = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      if (response.ok) {
          alert('Account created successfully!');
          window.location.href = 'main.html';
      } else {
          alert(result.message);  // Display error message
      }
  } catch (error) {
      console.error('Sign up error:', error);
      alert('An error occurred. Please try again.');
  }
});
