let allWorks = [];
fetch("http://localhost:5678/api/works")

  .then(response => response.json())
  .then(data => {
      allWorks = data;      
    afficherTravaux(allWorks);
  });
  
  function afficherTravaux(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
   
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

   
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

  
    figure.appendChild(img);
    figure.appendChild(figcaption);

   
    gallery.appendChild(figure);
  });
}
fetch("http://localhost:5678/api/categories")
.then(response => response.json())
  .then(data => {
    console.log(data); 
    afficherCategories(data);
  });

  function afficherCategories(categories) {
  const filtersContainer = document.querySelector(".filters");
  filtersContainer.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-btn", "active");
  allButton.dataset.id = "all";
  filtersContainer.appendChild(allButton);

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-btn");
    button.dataset.id = category.id;
    filtersContainer.appendChild(button);
  });

  setupFilters();
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Changer le style actif
      document.querySelector(".active")?.classList.remove("active");
      button.classList.add("active");

      const categoryId = button.dataset.id;

      if (categoryId === "all") {
        afficherTravaux(allWorks); 
      } else {
        
        const filteredWorks = allWorks.filter(work => work.categoryId == categoryId);
        afficherTravaux(filteredWorks);
      }
    });
  });
}
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche le rechargement de page

  const email = form.email.value;
  const password = form.password.value;

  errorMsg.textContent = ""; // Réinitialise le message d'erreur

  try {
    const response = await fetch("http://localhost:5678/api/login", { // Mets ton URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // Connexion réussie
      localStorage.setItem("token", data.token); // Stocke le token
      window.location.href = "index.html";      // Redirige vers l'accueil
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