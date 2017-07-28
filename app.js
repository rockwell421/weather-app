
/* This script includes a Vanilla JS and jQuery version

First, test API keys
fetch('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/47878e367578636e19c24f10a7277e1b/37.8267,-122.4233')
.then(response => response.json())
.then(data => console.log(data))

fetch('https://maps.googleapis.com/maps/api/geocode/json?address=montreal&key=AIzaSyA51hB_DAi5L71zacAO398ltEKDpmLAp_o')
.then(response => response.json())
.then(data => console.log(data))

*/
//new object constructor for the skycon
var skycons = new Skycons({"color": "orange"});

(function () {
var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = '47878e367578636e19c24f10a7277e1b';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

var GOOGLE_MAPS_API_KEY = 'AIzaSyA51hB_DAi5L71zacAO398ltEKDpmLAp_o';
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

function getCurrentWeather(coords) {
  var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

  return (
    fetch(url)
    .then(response => response.json())
    .then(data => data.currently)
  );
}

//this function returns a promise that will resolve with an object of lat/lng coordinates

function getCoordinatesForCity(cityName) {

  var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

  return (
    fetch(url)  //returns a promise for a response
    .then(response => response.json()) //returns a promise for the parsed json
    .then(data => data.results[0].geometry.location) //transform the response to take only what we need
  );
}

//UI JS

var app = document.querySelector('#app');
var cityForm = app.querySelector('.city-form');
var cityInput = cityForm.querySelector('.city-input');
var cityWeather = app.querySelector('.city-weather');
var cityForecast = app.querySelector('.city-forecast');

//Event Handlers

//clears the input form when clicked

cityInput.addEventListener('click', function (event) {
  event.preventDefault();
  cityInput.value = "";
})

//submits the AJAX call when button is clicked
cityForm.addEventListener('submit', function (event) {
  event.preventDefault(); //prevents the form from submitting
  var city = cityInput.value; //grab the current value of the input

  getCoordinatesForCity(city) //get coordinates for the input city
  .then(getCurrentWeather)    //get the weather for these coordinates
  .then(function(weather) {
    cityWeather.innerText = ' Current temperature: ' + weather.temperature;
    cityForecast.innerText = 'Today\'s Forecast: ' + weather.summary;
    console.log(weather);

    skycons.add("skycon", weather.icon); //targets the canvas for the skycon to appear when promise is resolved
    skycons.play();                     //loads the skycon

    })
  });
}) ();


/* Using JQuery
API keys are URLS have already been defined above


(function() {

  function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}`;

    return (
      $.getJSON(url)
      .then(data => data.currently)
    );
  }

  function getCoordinatesForCity(cityName) {
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      $.getJSON(url)
      .then(data => data.results[0].geometry.location)
    );
  }

  var app = $('#app')
  var cityForm = app.find('.city-form');
  var cityInput = cityForm.find('.city-input');
  var getWeatherButton = cityForm.find('.get-weather-button');
  var cityWeather = app.find('.city-weather');

  cityForm.on('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting

    var city = cityInput.val();

    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
      cityWeather.text('Current temperature: ' + weather.temperature);
    })
  });
})();


*/
