const pexelsApiKey = "";

const defaultBackgroundImageUrl = "assets/images/background.jpg";

applyBackgroundImage(defaultBackgroundImageUrl);

function setBackgroundImage(city, weatherCondition) {
  const query = `${city} ${weatherCondition} city`;
  fetchPexelsImage(query)
    .then((imageUrl) => {
      if (imageUrl) {
        applyBackgroundImage(imageUrl);
      } else {
        console.error("Error fetching Pexels image. Using default background.");
        applyBackgroundImage(defaultBackgroundImageUrl);
      }
    })
    .catch((error) => {
      console.error("Error fetching Pexels image:", error);
      applyBackgroundImage(defaultBackgroundImageUrl);
    });
}

function fetchPexelsImage(query) {
  const searchQuery = `${query}`;
  const endpoint = `https://api.pexels.com/v1/search?query=${searchQuery}`;
  return fetch(endpoint, {
    headers: {
      Authorization: pexelsApiKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large;
      }
      return null;
    });
}

function applyBackgroundImage(imageUrl) {
  document.body.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
}
