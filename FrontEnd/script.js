let allWorks = [];

fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    allWorks = data;

    afficherTravaux(allWorks);
    afficherTravauxModal(allWorks);
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

function afficherTravauxModal(works) {
  const gallery = document.querySelector(".modal-gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    figure.classList.add("item-modal");

    const img = document.createElement("img");
    img.src = work.imageUrl;

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete-btn");
    btnDelete.innerHTML = "🗑";

    btnDelete.addEventListener("click", () => {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${work.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.ok) {

    
      allWorks = allWorks.filter(w => w.id !== work.id);

     
      refreshUI();
    }
  });
});

    figure.appendChild(img);
    figure.appendChild(btnDelete);
    gallery.appendChild(figure);
  });
}

fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(data => {
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
      document.querySelector(".active")?.classList.remove("active");
      button.classList.add("active");

      const categoryId = button.dataset.id;

      if (categoryId === "all") {
        afficherTravaux(allWorks);
      } else {
        const filteredWorks = allWorks.filter(
          work => work.categoryId == categoryId
        );
        afficherTravaux(filteredWorks);
      }
    });
  });
}

const modal = document.getElementById("modal");
const btnModifier = document.querySelector('a[href="#modal"]');
const closeBtn = modal.querySelector(".close");
const zoneGalerie = modal.querySelector(".zone-galerie");
const zoneFormulaire = modal.querySelector(".zone-formulaire");
const btnAddPhoto = modal.querySelector("#btn-photo");
const backBtn = modal.querySelector(".back");

function openModal(e) {
  e.preventDefault();
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  modal.setAttribute("aria-hidden", "false");

  zoneGalerie.style.display = "block";
  zoneFormulaire.style.display = "none";
}

function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  zoneFormulaire.style.display = "none";
  zoneGalerie.style.display = "block";
}

btnModifier.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

btnAddPhoto.addEventListener("click", () => {
  zoneGalerie.style.display = "none";
  zoneFormulaire.style.display = "block";
});

backBtn.addEventListener("click", () => {
  zoneFormulaire.style.display = "none";
  zoneGalerie.style.display = "block";
});



function refreshUI() {
  afficherTravaux(allWorks);
  afficherTravauxModal(allWorks);
}

const form = document.getElementById("form-ajout");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = document.getElementById("fileInput").files[0];
  const title = document.querySelector('[name="titre"]').value;
  const category = document.querySelector('[name="categorie"]').value;
  const token = localStorage.getItem("token");

  if (!file || !title || !category) {
    alert("Formulaire incomplet");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", Number(category));

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
  .then(() => {
    return fetch("http://localhost:5678/api/works");
  })
  .then(res => res.json())
  .then(data => {
    allWorks = data;
    refreshUI();
    closeModal();
  });

  form.reset();
  document.querySelector(".preview-img")?.remove();
});

