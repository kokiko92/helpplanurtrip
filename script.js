document.addEventListener("DOMContentLoaded", () => {
  // Initialisation de la carte
  const map = L.map("map", {
    center: [20, 0], // Coordonnées centrales
    zoom: 2,         // Zoom initial
    minZoom: 2,      // Niveau de zoom minimum
    maxBounds: [     // Limites maximales de la carte
      [-90, -180],   // Sud-Ouest (latitude, longitude)
      [90, 180]      // Nord-Est (latitude, longitude)
    ],
    maxBoundsViscosity: 1.0 // Force l'utilisateur à rester dans les limites
  });

  // Ajout de la couche de tuiles OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Liste des pays visités (ISO Alpha-3)
  const visitedCountries = [
    "FRA", "ESP", "USA", "JPN", "ITA", "DEU", "DNK", "CHE", "GBR", "BEL", 
    "PRT", "CAN", "MEX", "GTM", "BLZ", "MAR", "TGO", "BEN", "VNM", "THA", 
    "AUS", "LKA", "IND", "CHN", "UKR", "RUS", "NPL", "MMR", "LAO", "IDN", 
    "COL", "BOL", "PER", "HRV", "TUR", "IRN", "ZAF", "SWZ", "ROU", "GRC", 
    "ISR", "NLD", "ISL", "NOR", "ARE"
  ];

  // Charger les frontières des pays depuis un GeoJSON public
  fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: feature => ({
          color: "#666", // Contour des pays
          weight: 1,
          fillColor: visitedCountries.includes(feature.properties.ISO_A3) ? "#4caf50" : "#ddd",
          fillOpacity: 0.7
        }),
        onEachFeature: (feature, layer) => {
          const countryName = feature.properties.ADMIN;
          const visited = visitedCountries.includes(feature.properties.ISO_A3);

          // Ajouter une infobulle
          layer.bindPopup(
            `<strong>${countryName}</strong><br>` +
            (visited ? `Itineraries and tips <a href="#ancrage">here</a>` : "Not visited")
          );

          // Ajouter un effet de surbrillance au survol
          layer.on("mouseover", function () {
            this.setStyle({
              fillColor: "#ffcc00",
              fillOpacity: 0.9
            });
          });
          layer.on("mouseout", function () {
            this.setStyle({
              fillColor: visited ? "#4caf50" : "#ddd",
              fillOpacity: 0.7
            });
          });

          // Ajouter un événement au clic
          layer.on("click", () => {
            console.log(`Vous avez cliqué sur ${countryName}`);
          });
        }
      }).addTo(map);
    })
    .catch(error => {
      console.error("Erreur lors du chargement des données GeoJSON :", error);
    });

  // Smooth scroll for the "contact me" link
  const ctaLink = document.querySelector('.cta-link');
  if (ctaLink) {
    ctaLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector('#ancrage');
      target.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
//Ajuster contenu
function ajusterContenu() {
  const largeurEcran = window.innerWidth;

  // Récupérer les éléments du header et du blog
  const titrePrincipal = document.querySelector("header h1");
  const imagesHeader = document.querySelector("header img");
  const imagesBlog = document.querySelectorAll(".section2 img");

  if (largeurEcran > 1024) {
    // Styles pour les grands écrans
    titrePrincipal.style.fontSize = "2.8em"; // Légèrement réduire le titre
    if (imagesHeader) {
      imagesHeader.style.maxWidth = "280px"; // Réduction légère de l'image du header
      imagesHeader.style.height = "auto"; // Conserver les proportions
    }
    imagesBlog.forEach((img) => {
      img.style.maxWidth = "600px"; // Taille standard pour les images de blog
      img.style.height = "auto";
    });
  } else if (largeurEcran < 768) {
    // Styles pour les petits écrans
    titrePrincipal.style.fontSize = "2em"; // Réduire le titre pour les petits écrans
    if (imagesHeader) {
      imagesHeader.style.maxWidth = "180px"; // Réduction légère pour mobile
      imagesHeader.style.height = "auto";
    }
    imagesBlog.forEach((img) => {
      img.style.maxWidth = "100%"; // Images remplissent toute la largeur disponible
      img.style.height = "auto";
    });
  } else {
    // Styles intermédiaires
    titrePrincipal.style.fontSize = "2.4em"; // Taille intermédiaire pour le titre
    if (imagesHeader) {
      imagesHeader.style.maxWidth = "240px"; // Réduction intermédiaire pour l'image du header
      imagesHeader.style.height = "auto";
    }
    imagesBlog.forEach((img) => {
      img.style.maxWidth = "90%"; // Taille intermédiaire pour les images de blog
      img.style.height = "auto";
    });
  }
}

// Appeler la fonction au chargement et lors des redimensionnements
ajusterContenu();
window.addEventListener("resize", ajusterContenu);

