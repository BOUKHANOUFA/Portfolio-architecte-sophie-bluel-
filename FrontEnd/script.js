fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    afficherTravaux(data);
  });
  function afficherTravaux(works) {
  const gallery = document.querySelector(".gallery");

  works.forEach(work => {
    // créer les éléments
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    // remplir les données
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    // assembler
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // ajouter à la galerie
    gallery.appendChild(figure);
  });
}
fetch("http://localhost:5678/api/categories")
.then(response => response.json())
  .then(data => {
    console.log(data); 
    afficherCategories(data);
  });
  const button = document.createElement("button");
