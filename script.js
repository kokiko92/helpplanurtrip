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
  const visitedCountries = ["FRA"];

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
  const ctaBut = document.querySelector('.cta-button');
  if (ctaBut) {
    ctaBut.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector('#ancrage');
      target.scrollIntoView({ behavior: 'smooth' });
    }); 
  }
});
