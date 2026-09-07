document.addEventListener('DOMContentLoaded', () => {
  // Select all elements marked with the `data-view` attribute.
  // These are the different "pages" or sections the router will toggle.
  // Example HTML: <div id="signup" data-view class="hidden">...</div>
  const views = document.querySelectorAll('[data-view]');

  // show(hash): display the view whose id matches the hash (without '#').
  // If no hash is present, fall back to the default view id 'login'.
  function show(hash) {
    const id = (hash && hash.replace('#', '')) || 'login';
    // Toggle the 'hidden' class on each view depending on the match.
    views.forEach(v => v.id === id ? v.classList.remove('hidden') : v.classList.add('hidden'));
  }

  // Listen for hash changes so links like <a href="#signup"> work and
  // Back/Forward browser navigation updates the visible view.
  window.addEventListener('hashchange', () => show(location.hash));

  // Initialize the correct view on page load based on the current hash.
  show(location.hash);
});

const email = document.getElementById("email");
const password = document.getElementById("password");
const emailValue = email.value.trim();
const passwordValue = password.value.trim();
function userAuthenticate(){
    const storedEmail = localStorage.getItem("userEmail" );
    const storedPassword = localStorage.getItem("userPassword");
    if (emailValue === storedEmail && passwordValue === storedPassword){
        alert("Login successful");
        window.location.href = "dashoard.html";
    }else {
        alert("invalid credentials");
    }
}
document.getElementById("login-btn").addEventListner("click", userAuthenticate());