const geoapifyApiKey = "";
const geoapifyApiUrl = "https://api.geoapify.com/v1/geocode/autocomplete";

document
  .getElementById("autocomplete-input")
  .addEventListener("input", function () {
    const query = this.value.trim();
    if (query.length > 2) {
      fetchCities(query);
    } else {
      clearAutocompleteResults();
    }
  });

document.getElementById("searchButton").addEventListener("click", function () {
  clearAutocompleteResults();
  getWeather();
});

document
  .getElementById("autocomplete-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      if (
        document.getElementById("autocomplete-results").childElementCount > 0
      ) {
        clearAutocompleteResults();
        getWeather();
      }
    }
  });

let autocompleteResultsCleared = false;
document.addEventListener("click", function (event) {
  const autocompleteInput = document.getElementById("autocomplete-input");
  const autocompleteResults = document.getElementById("autocomplete-results");

  if (
    !autocompleteInput.contains(event.target) &&
    !autocompleteResults.contains(event.target)
  ) {
    clearAutocompleteResults();
    autocompleteResultsCleared = true;
  } else {
    autocompleteResultsCleared = false;
  }
});

document
  .getElementById("autocomplete-input")
  .addEventListener("focus", function () {
    const autocompleteResults = document.getElementById("autocomplete-results");

    if (autocompleteResultsCleared) {
      fetchCities(this.value.trim());
    }
  });

function fetchCities(query) {
  fetch(`${geoapifyApiUrl}?text=${query}&apiKey=${geoapifyApiKey}`)
    .then((response) => response.json())
    .then((data) => {
      displayAutocompleteResults(data.features);
    })
    .catch((error) => {
      console.error("Error fetching city data:", error);
    });
}

function displayAutocompleteResults(features) {
  const resultsContainer = document.getElementById("autocomplete-results");
  resultsContainer.innerHTML = "";

  if (features && features.length > 0) {
    features.forEach((feature) => {
      const city = feature.properties;
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");
      resultItem.innerHTML = `<span class="city-name">${city.formatted}</span>`;
      resultItem.addEventListener("click", function () {
        document.getElementById("autocomplete-input").value = city.formatted;
        clearAutocompleteResults();
        getWeather();
      });
      resultsContainer.appendChild(resultItem);
    });
  } else {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    resultItem.textContent = "No results found";
    resultsContainer.appendChild(resultItem);
  }
}

function clearAutocompleteResults() {
  document.getElementById("autocomplete-results").innerHTML = "";
}
