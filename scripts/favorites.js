document.addEventListener("DOMContentLoaded", function () {
  loadFavoritesFromLocalStorage();
  displayFavoriteCities();
});

function loadFavoritesFromLocalStorage() {
  const favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  return favorites;
}

function saveFavoritesToLocalStorage(favorites) {
  localStorage.setItem("favoriteCities", JSON.stringify(favorites));
}

function addCityToFavorites(city) {
  const favorites = loadFavoritesFromLocalStorage();
  if (!favorites.includes(city)) {
    favorites.push(city);
    saveFavoritesToLocalStorage(favorites);
    displayFavoriteCities();
  }
}

function removeCityFromFavorites(city, event) {
  event.preventDefault();
  event.stopPropagation();
  const favorites = loadFavoritesFromLocalStorage();
  const index = favorites.indexOf(city);
  if (index !== -1) {
    favorites.splice(index, 1);
    saveFavoritesToLocalStorage(favorites);
    displayFavoriteCities();
  }
}

function displayFavoriteCities() {
  const favoritesContainer = document.getElementById("favoritesContainer");
  favoritesContainer.innerHTML = "";
  const favorites = loadFavoritesFromLocalStorage();
  if (favorites.length > 0) {
    favorites.forEach((city) => {
      const favoriteItem = document.createElement("div");
      favoriteItem.classList.add("favorite-item");
      const clickableText = document.createElement("span");
      clickableText.classList.add("clickable-text");
      clickableText.textContent = city;
      clickableText.addEventListener("click", function () {
        document.getElementById("autocomplete-input").value = city;
        getWeather();
      });
      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", function (event) {
        removeCityFromFavorites(city, event);
      });
      favoriteItem.appendChild(clickableText);
      favoriteItem.appendChild(removeButton);

      favoritesContainer.appendChild(favoriteItem);
    });
  } else {
    const noFavoritesMessage = document.createElement("div");
    noFavoritesMessage.classList.add("no-favorites-message");
    noFavoritesMessage.textContent = "No favorite cities yet.";
    favoritesContainer.appendChild(noFavoritesMessage);
  }
}
