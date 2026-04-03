let allWorks = [];
fetch ("http://localhost:5678/api/works")

  .then (response => response.json())
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
  const filters = document.querySelector(".filters");
  filters.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-btn", "active");
  allButton.dataset.id = "all";
  filters.appendChild(allButton);

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-btn");
    button.dataset.id = category.id;
    filters.appendChild(button);
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
