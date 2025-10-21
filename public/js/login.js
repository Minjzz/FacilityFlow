document.getElementById("loginForm").addEventListener("submit", function (e) {
  const btn = document.getElementById("loginBtn");
  btn.disabled = true;
  btn.innerText = "Signing in...";
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  const btn = document.getElementById("signupBtn");
  btn.disabled = true;
  btn.innerText = "Creating account...";
});
