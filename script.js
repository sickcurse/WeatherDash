let searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];
const weatherUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'cffa92cd0ca96f94480dd91598059b25';

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const today = document.querySelector('#today');
const forecast= document.querySelector('#forecast');
const searchHistoryContainer = document.querySelector('#history');