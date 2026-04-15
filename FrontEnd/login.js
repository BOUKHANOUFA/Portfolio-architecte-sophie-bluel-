const form = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const email = form.email.value;
  const password = form.password.value;

  errorMsg.textContent = ""; 

  try {
    const response = await fetch("http://localhost:5678/api/users/login", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data = {};
try {
  data = await response.json();
} catch {}

    if (response.ok && data.token) {
      // Connexion réussie
      localStorage.setItem("token", data.token); 
      window.location.href = "index.html";      
    } else {
      // Connexion échouée
      errorMsg.textContent = "Email ou mot de passe incorrect";
    }

  } catch (error) {
    console.error("Erreur :", error);
    errorMsg.textContent = "Une erreur est survenue, réessayez plus tard";
  }
});



const token = localStorage.getItem("token");

if (token) {
  console.log("Utilisateur connecté");
} else {
  console.log("Utilisateur non connecté");
}


