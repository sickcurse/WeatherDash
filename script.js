let searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];
const weatherUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'cffa92cd0ca96f94480dd91598059b25';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const todayContainer = document.querySelector('#today');
const forecastContainer = document.querySelector('#forecast');
const searchHistoryContainer = document.querySelector('#history');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderSearchHistory() {
  searchHistoryContainer.innerHTML = searchHistory.map(city =>
    `<button type="button" data-search="${city}">${city}</button>`
  ).join('');
}

function appendToHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
  }
}

function renderWeather(city, weather) {
  todayContainer.innerHTML = `
    <div class="weather-card">
      <h2>${city} (${dayjs().format('M/D/YYYY')})
        <img src="https://openweathermap.org/img/w/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
      </h2>
      <p>Temp: ${weather.main.temp}°F</p>
      <p>Wind: ${weather.wind.speed} MPH</p>
      <p>Humidity: ${weather.main.humidity}%</p>
    </div>`;
}

function renderForecast(forecast) {
  forecastContainer.innerHTML = forecast.filter(f => dayjs(f.dt_txt).hour() === 12).map(f => `
    <div class="five-day-card">
      <h5>${dayjs(f.dt_txt).format('M/D/YYYY')}</h5>
      <img src="https://openweathermap.org/img/w/${f.weather[0].icon}.png" alt="${f.weather[0].description}">
      <p>Temp: ${f.main.temp} °F</p>
      <p>Wind: ${f.wind.speed} MPH</p>
      <p>Humidity: ${f.main.humidity}%</p>
    </div>`).join('');
}

function fetchWeather(location) {
  fetch(`${weatherUrl}/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=imperial&appid=${weatherApiKey}`)
    .then(res => res.json())
    .then(data => {
      renderWeather(location.name, data.list[0]);
      renderForecast(data.list);
    });
}

function fetchCoords(city) {
  fetch(`${weatherUrl}/geo/1.0/direct?q=${city}&limit=5&appid=${weatherApiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data[0]) {
        appendToHistory(city);
        fetchWeather(data[0]);
      } else {
        alert('Location not found');
      }
    });
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) fetchCoords(city);
  searchInput.value = '';
});

searchHistoryContainer.addEventListener('click', e => {
  if (e.target.matches('button')) fetchCoords(e.target.dataset.search);
});

renderSearchHistory();
