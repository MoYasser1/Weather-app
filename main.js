const baseURL = 'http://api.weatherapi.com/v1';
const apiKey = 'de5f5e85a8684af4b87150227240701';
let debounceTimer;
let typingTimer;
const doneTypingInterval = 1000;

$(document).ready(function () {
  $('#cityInput').on('input', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(getWeather, doneTypingInterval);
  });
});

function getWeather() {
  const cityInput = $('#cityInput').val();
  if (cityInput.trim() !== '') {
    $.ajax({
      url: `${baseURL}/forecast.json?key=${apiKey}&q=${cityInput}&days=3`,
      method: 'GET',
      success: function (response) {
        console.log(response); // Add this line to check the data in the console
        displayWeather(response);
      },
      error: function (error) {
        console.error('Error fetching weather data:', error);
        displayError();
      }
    });
  }
}

function displayWeather(data) {
  const weatherCardsContainer = $('#weatherCards');
  weatherCardsContainer.empty();

  for (let i = 0; i < 3; i++) {
    const dayData = data.forecast.forecastday[i];
    const date = new Date(dayData.date);
    const dayName = getDayName(date.getDay());
    const card = `
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="card text-bg-secondary mb-3 transparent-card">
          <div class="card-header">${dayName}</div>
          <div class="card-body">
            <h5 class="card-title">${data.location.name}</h5>
            <p class="card-text">${dayData.day.condition.text}</p>
            <p class="card-text">Temperature: ${dayData.day.avgtemp_c}°C</p>
            <img src="${dayData.day.condition.icon}" alt="${dayData.day.condition.text}" />
          </div>
        </div>
      </div>
    `;
    weatherCardsContainer.append(card);
  }
}

function displayError() {
  const weatherCardsContainer = $('#weatherCards');
  weatherCardsContainer.empty();

  const errorMessage = `
    <div class="col-12">
      <div class="alert alert-danger" role="alert">
        City not found. Please enter a valid city name.
      </div>
    </div>
  `;
  weatherCardsContainer.append(errorMessage);
}

function getDayName(dayIndex) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}