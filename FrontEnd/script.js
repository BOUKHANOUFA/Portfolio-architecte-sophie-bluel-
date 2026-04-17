document.addEventListener("DOMContentLoaded", () => {

let allWorks = [];

/* =======================
   TOKEN + MODE EDITION
======================= */
const token = localStorage.getItem("token");

const filters = document.querySelector(".filters");
const modifierBtn = document.querySelector(".btn-modifier");
const iconModifier = document.querySelector(".group");
const editMode = document.getElementById("edit-mode");

if (token) {
  if (filters) filters.style.display = "none";
  if (editMode) editMode.classList.remove("hidden");
} else {
  if (modifierBtn) modifierBtn.style.display = "none";
  if (iconModifier) iconModifier.style.display = "none";
}

const loginLink = document.querySelector('a[href="login.html"]');

if (token && loginLink) {
  loginLink.textContent = "logout";

  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.reload();
  });
}

/* =======================
   RECUP WORKS
======================= */
fetch("http://localhost:5678/api/works")
  .then(res => res.json())
  .then(data => {
    allWorks = data;
    afficherTravaux(allWorks);
    afficherTravauxModal(allWorks);
  });

/* =======================
   AFFICHAGE GALERIE
======================= */
function afficherTravaux(works) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

/* =======================
   MODALE GALERIE
======================= */
function afficherTravauxModal(works) {
  const gallery = document.querySelector(".modal-gallery");
  if (!gallery) return;

  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;

    const btnDelete = document.createElement("button");
btnDelete.classList.add("delete-btn");

const icon = document.createElement("i");
icon.classList.add("fa-solid", "fa-trash-can");

btnDelete.appendChild(icon);

    btnDelete.addEventListener("click", () => {
      const token = localStorage.getItem("token");

      fetch(`http://localhost:5678/api/works/${work.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) {
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

/* =======================
   CATEGORIES + FILTRES
======================= */
fetch("http://localhost:5678/api/categories")
  .then(res => {
  if (!res.ok) throw new Error("Erreur API");
  return res.json();
})
  .then(data => {
    afficherCategories(data);
    remplirSelect(data);
  });

function afficherCategories(categories) {
  const filters = document.querySelector(".filters");
  if (!filters) return;

  filters.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-btn", "active");
  allButton.dataset.id = "all";
  filters.appendChild(allButton);

  categories.forEach(cat => {
    const button = document.createElement("button");
    button.textContent = cat.name;
    button.classList.add("filter-btn");
    button.dataset.id = cat.id;
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
        const filtered = allWorks.filter(
          w => w.categoryId == categoryId
        );
        afficherTravaux(filtered);
      }
    });
  });
}

function remplirSelect(categories) {
  const select = document.getElementById("categorie-select");
  if (!select) return;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

/* =======================
   MODALE
======================= */
const modal = document.getElementById("modal");
const btnModifier = document.querySelector(".btn-modifier");
const closeBtn = modal?.querySelector(".close");
const zoneGalerie = modal?.querySelector(".zone-galerie");
const zoneFormulaire = modal?.querySelector(".zone-formulaire");
const btnAddPhoto = modal?.querySelector("#btn-photo");
const backBtn = modal?.querySelector(".back");

function openModal(e) {
  e.preventDefault();
  if (!modal) return;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  modal.setAttribute("aria-hidden", "false");

  zoneGalerie.style.display = "block";
  zoneFormulaire.style.display = "none";
}

function closeModal() {
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "auto";

  form.reset();
  document.querySelector(".preview-img")?.remove();
}

btnModifier?.addEventListener("click", openModal);
closeBtn?.addEventListener("click", closeModal);

modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

btnAddPhoto?.addEventListener("click", () => {
  zoneGalerie.style.display = "none";
  zoneFormulaire.style.display = "block";
});

backBtn?.addEventListener("click", () => {
  zoneFormulaire.style.display = "none";
  zoneGalerie.style.display = "block";
});

/* =======================
   REFRESH UI
======================= */
function refreshUI() {
  afficherTravaux(allWorks);
  afficherTravauxModal(allWorks);
}

/* =======================
   FORM AJOUT WORK
======================= */
const form = document.getElementById("form-ajout");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = document.getElementById("fileInput").files[0];
  const title = document.querySelector('[name="titre"]').value;
  const category = document.querySelector('[name="categorie"]').value;
  const token = localStorage.getItem("token");

  document.querySelector(".error-msg")?.remove();

  if (!file || !title || !category) {
    const error = document.createElement("p");
    error.classList.add("error-msg");
    error.textContent = "Veuillez remplir tous les champs";
    error.style.color = "red";
    form.appendChild(error);
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
  .then(() => fetch("http://localhost:5678/api/works"))
  .then(res => res.json())
  .then(data => {
    allWorks = data;
    refreshUI();
    closeModal();
  });

  if (form) form.reset();
  document.querySelector(".preview-img")?.remove();
});

/* =======================
   PREVIEW IMAGE
======================= */
const fileInput = document.getElementById("fileInput");

fileInput?.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    const preview = document.createElement("img");
    preview.classList.add("preview-img");
    preview.src = URL.createObjectURL(file);

    const box = document.querySelector(".upload-content");
    if (!box) return;

    const old = document.querySelector(".preview-img");
    if (old) old.remove();
box.innerHTML = "";
box.appendChild(preview);
  }
});

});
