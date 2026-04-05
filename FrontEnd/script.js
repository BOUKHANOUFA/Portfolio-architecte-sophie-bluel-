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


const modal = document.getElementById('modal1');
const btnModifier = document.querySelector('a[href="#modal1"]');
const closeBtn = modal.querySelector('.close');
const zoneGalerie = modal.querySelector('.zone-galerie');
const zoneFormulaire = modal.querySelector('.zone-formulaire');
const btnAddPhoto = modal.querySelector('#btn-photo');
const backBtn = modal.querySelector('.back');


function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    zoneFormulaire.style.display = 'none';
    zoneGalerie.style.display = 'block';
}


btnModifier.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    zoneGalerie.style.display = 'block';
    zoneFormulaire.style.display = 'none';
});


closeBtn.addEventListener('click', closeModal);


window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});


btnAddPhoto.addEventListener('click', () => {
    zoneGalerie.style.display = 'none';
    zoneFormulaire.style.display = 'block';
});


if (backBtn) {
    backBtn.addEventListener('click', () => {
        zoneFormulaire.style.display = 'none';
        zoneGalerie.style.display = 'block';
    });
}