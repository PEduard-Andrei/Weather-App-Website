const apiKey = "";
const weatherApiUrl = "https://api.weatherapi.com/v1/current.json";
const forecastApiUrl = "https://api.weatherapi.com/v1/forecast.json";

function getWeather() {
  const cityInput = document.getElementById("autocomplete-input").value;

  if (cityInput.trim() !== "") {
    showLoadingSpinner();

    setTimeout(() => {
      fetch(`${weatherApiUrl}?key=${apiKey}&q=${cityInput}`)
        .then((response) => response.json())
        .then((data) => {
          displayWeatherData(data);
          return fetch(`${forecastApiUrl}?key=${apiKey}&q=${cityInput}&days=5`);
        })
        .then((response) => response.json())
        .then((forecastData) => {
          displayForecastData(forecastData);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          hideLoadingSpinner();
          alert("Error fetching weather data. Please try again.");
        });
    }, 2000);
  }
}

function showLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
  document.getElementById("weatherData").style.display = "none";
}

function hideLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

function displayWeatherData(data) {
  hideLoadingSpinner();
  document.getElementById("weatherData").style.display = "block";
  const cityNameContainer = document.getElementById("cityName");
  cityNameContainer.innerHTML = `
        <span class="city-name">${data.location.name}</span>
        <button class="heart-button" onclick="addCityToFavorites('${data.location.name}')">&#10084;</button>
    `;
  document.getElementById(
    "temperature"
  ).innerHTML = `<span class="weather-icon">&#127777;</span>${Math.round(
    data.current.temp_c
  )}°C`;
  document.getElementById(
    "skyCondition"
  ).innerHTML = `<span class="weather-icon">&#9729;</span>${data.current.condition.text}`;
  document.getElementById(
    "humidity"
  ).innerHTML = `<span class="weather-icon">&#9730;</span>${data.current.humidity}%`;
  document.getElementById(
    "windInfo"
  ).innerHTML = `<span class="weather-icon">&#9721;</span>${Math.round(
    data.current.wind_kph
  )} km/h ${data.current.wind_dir}`;
  setBackgroundImage(data.location.name, data.current.condition.text);
}

function displayForecastData(forecastData) {
  const forecastContainer = document.getElementById("forecastData");
  const forecastButtonsContainer = document.getElementById("forecastButtons");
  forecastButtonsContainer.innerHTML = "";
  forecastContainer.innerHTML = "";
  forecastData.forecast.forecastday.forEach((day) => {
    const button = document.createElement("button");
    const date = new Date(day.date);
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())}`;
    button.innerText = formattedDate;
    button.onclick = () => displayDayForecast(day);
    forecastButtonsContainer.appendChild(button);
  });
  displayDayForecast(forecastData.forecast.forecastday[0]);
}

function displayDayForecast(day) {
  const forecastContainer = document.getElementById("forecastData");
  forecastContainer.innerHTML = "";
  const maxTemp = Math.round(day.day.maxtemp_c);
  const minTemp = Math.round(day.day.mintemp_c);
  const windSpeed = Math.round(day.day.maxwind_kph);
  const windDirection = day.day.wind_dir ? day.day.wind_dir : "N/A";
  const forecastItem = document.createElement("div");
  forecastItem.innerHTML = `
        <p><span class="weather-icon">&#128197;</span>${day.date}</p>
        <p><span class="weather-icon">&#127777;</span>${maxTemp}°C / ${minTemp}°C</p>
        <p><span class="weather-icon">&#9729;</span>${day.day.condition.text}</p>
        <p><span class="weather-icon">&#9730;</span>${day.day.avghumidity}%</p>
        <p><span class="weather-icon">&#9721;</span>${windSpeed} km/h ${windDirection}</p>
        <hr>
    `;
  forecastContainer.appendChild(forecastItem);
}
function getMonthName(month) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month];
}
