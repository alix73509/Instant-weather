document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments
    const codePostalInput = document.getElementById("code-postal");
    const communeSelect = document.getElementById("communeSelect");
    const validationButton = document.getElementById("validationButton");
  
    // Fonction pour effectuer la requête API des communes en utilisant le code postal
    async function fetchCommunesByCodePostal(codePostal) {
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?codePostal=${codePostal}`
        );
        const data = await response.json();
        console.table(data);
        return data;
      } catch (error) {
        console.error("Erreur lors de la requête API:", error);
        throw error;
      }
    }
  
    // Fonction pour afficher les communes dans la liste déroulante
    function displayCommunes(data) {
      communeSelect.innerHTML = "";
      if (data.length === 1) {
        const commune = data[0];
        communeSelect.innerHTML = `<option value="${commune.code}">${commune.nom}</option>`;
      } else if (data.length > 1) {
        data.forEach((commune) => {
          const option = document.createElement("option");
          option.value = commune.code;
          option.textContent = commune.nom;
          communeSelect.appendChild(option);
        });
      }
      communeSelect.style.display = "block";
      validationButton.style.display = "block";
    }
  
    // Fonction pour effectuer la requête API de météo en utilisant le code de la commune sélectionnée
    async function fetchMeteoByCommune(selectedCommune) {
      try {
        const response = await fetch(
          `https://api.meteo-concept.com/api/forecast/daily/0?token=4bba169b3e3365061d39563419ab23e5016c0f838ba282498439c41a00ef1091&insee=${selectedCommune}`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Erreur lors de la requête API:", error);
        throw error;
      }
    }
  
    // Ajout de l'écouteur d'événement "input" sur le champ code postal
    codePostalInput.addEventListener("input", async () => {
      const codePostal = codePostalInput.value;
      communeSelect.style.display = "none";
      validationButton.style.display = "none";
  
      if (/^\d{5}$/.test(codePostal)) {
        try {
          const data = await fetchCommunesByCodePostal(codePostal);
          displayCommunes(data);
        } catch (error) {
          console.error(
            "Une erreur est survenue lors de la recherche de la commune :",
            error
          );
          throw error;
        }
      }
    });
  
    // Ajout de l'écouteur d'événement "click" sur le bouton de validation
    validationButton.addEventListener("click", async () => {
      const selectedCommune = communeSelect.value;
      if (selectedCommune != null) {
        try {
          const data = await fetchMeteoByCommune(selectedCommune);
          createCard(data);
        } catch (error) {
          console.error("Erreur lors de la requête API meteoConcept:", error);
          throw error;
        }
      }
    });
  });

  //////////////////////////////////////////////////////////////////

  function createCard(data) {
    // Créer un conteneur pour les informations météo
    let weatherContainer = document.createElement("div");
    weatherContainer.classList.add("bg-white", "rounded-lg", "shadow-lg", "p-6", "mt-6", "max-w-md", "mx-auto");

    // Créer de nouvelles divs avec des classes Tailwind pour styliser les informations
    let weatherTmin = document.createElement("div");
    let weatherTmax = document.createElement("div");
    let weatherPrain = document.createElement("div");
    let weatherSunHours = document.createElement("div");

    // Ajouter du contenu aux divs
    weatherTmin.textContent = `Température minimale : ${data.forecast.tmin}°C`;
    weatherTmax.textContent = `Température maximale : ${data.forecast.tmax}°C`;
    weatherPrain.textContent = `Probabilité de pluie : ${data.forecast.probarain}%`;
    weatherSunHours.textContent = `Ensoleillement journalier : ${displayHours(data.forecast.sun_hours)}`;

    // Ajouter des classes Tailwind pour chaque div
    weatherTmin.classList.add("text-lg", "font-medium", "text-gray-700", "mb-2");
    weatherTmax.classList.add("text-lg", "font-medium", "text-gray-700", "mb-2");
    weatherPrain.classList.add("text-lg", "font-medium", "text-gray-700", "mb-2");
    weatherSunHours.classList.add("text-lg", "font-medium", "text-gray-700", "mb-2");

    // Ajouter les divs au conteneur
    weatherContainer.appendChild(weatherTmin);
    weatherContainer.appendChild(weatherTmax);
    weatherContainer.appendChild(weatherPrain);
    weatherContainer.appendChild(weatherSunHours);

    // Sélectionner la section météo
    let weatherSection = document.getElementById("weatherInformation");
    let requestSection = document.getElementById("cityForm");

    // Ajouter le conteneur au weatherSection
    weatherSection.appendChild(weatherContainer);

    // Ajouter un bouton de retour vers le formulaire
    let reloadButton = document.createElement("button");
    reloadButton.textContent = "Nouvelle recherche";
    reloadButton.classList.add("mt-4", "bg-blue-600", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded", "block", "mx-auto");
    weatherContainer.appendChild(reloadButton);

    // Ajouter un listener sur le bouton
    reloadButton.addEventListener("click", function () {
      location.reload();
    });

    // Gérer la visibilité des sections
    requestSection.style.display = "none";
    weatherSection.style.display = "block";
}

  
  function displayHours(sunHours) {
    return sunHours + (sunHours > 1 ? " heures" : " heure");
  }
