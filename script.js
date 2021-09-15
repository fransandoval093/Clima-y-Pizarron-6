// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GLOBAL VARIABLE DEFINITIONS
// var inputEl = document.getElementById("input-text").value;
var submitBtnEl = document.getElementById('submit-btn')
var contentEl = document.getElementById('content-display');
var myCities = {}
var d = new Date();
var date = d.getMonth()+d.getDate()+d.getFullYear()

const STORAGE_KEY = "citiesSearched"
const API_KEY = "b3041596dbecb7fc61c1d4b91298ae63" // For weather API
const RAPIDAPI_KEY = "b991af6626msh20817527d58c008p114012jsnafbe85f9a112" // For RapidAPI
const GEOCODE_URL = "https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?city="
const GEOCODE_HOST = "forward-reverse-geocoding.p.rapidapi.com"
const WEATHER_URL = "https://community-open-weather-map.p.rapidapi.com/weather?units=%22imperial%22&mode=html&q=";
const WEATHER_HOST = "community-open-weather-map.p.rapidapi.com";
const WICON = ["http://openweathermap.org/img/w/", ".png"] // http://openweathermap.org/img/w/10d.png

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// FUNCTION DEFINITIONS 

// SEARCH AND APPEND | JS
function search() {
  var input = document.getElementById("input-text").value;
  document.getElementById("content-display").innerHTML = input;
  document.getElementById("input-text").value = "";
  return input;
}
// SET TO LOCAL STORAGE | Takes an item name and value as a parameter value
function populateStorage(item, value) {
  myObj = value; // myCities
  myJSON = JSON.stringify(myObj);                 // storing data
  localStorage.setItem(item, myJSON);
}

// RETRIEVE FROM LOCAL STORAGE | Calling function with a parameter name will return the string value of the item.
function retrieveStorage(item) {
  text = localStorage.getItem(item);        // retrieving data 
  obj = JSON.parse(text);
  return obj
}

// TODO: Generalize function to fit any GET request
// FETCH FUNCTION RETURNS JSON OBJECTS | Function has been specialized to work with RapidApi.
const getData = async (url, host) => {
  const response = await fetch(url, {
    method: "GET",
    redirect: 'follow',
    headers: {
      accept: "*/*",
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": host,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
// FETCH GET FUNCTION | With the assumption that validation key is included in the request.
const getData2 = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// KELVIN TO FARENHEIT
const kelvinFarenheit = (K) => {
  F = Math.floor((K - (273.15)) * (9/5) * 32)
  return F
}

const querySearcher = async () => {
  // Gets city name and replaces spaces with "%20" for url parsing
  let city = search()
  let CITY = city.replace(' ', '%20');
  CITY_GEOCODE_URL = GEOCODE_URL + CITY

  // Get city data location data
  const cityLocation = await getData(CITY_GEOCODE_URL, GEOCODE_HOST);
  let CITY_LAT = cityLocation[0].lat
  let CITY_LONG = cityLocation[0].lon

  // Add searched city to myCities object
  myCities[city] = [CITY_LAT, CITY_LONG]
  populateStorage(STORAGE_KEY, myCities)
  console.log(`The city of ${city} has coords. of ${CITY_LAT},${CITY_LONG}`);
  console.log(myCities);

  // Get city climate data | Feeds Lat and Long into Open Weather API
  const cityData = await getData2(`https://api.openweathermap.org/data/2.5/onecall?lat=${CITY_LAT}&lon=${CITY_LONG}&appid=${API_KEY}`)
  console.log(cityData.current.weather);
  iconcode = cityData.current.weather[0].icon;
  iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png"
  temp = cityData.current.temp
  windSpeed = cityData.current.weather[5];


  const app = document.getElementById("card");
  app.innerHTML += /*html*/ `
  <div class="card">
      <div class="city">${city}</div>
      <div class="date">${date}</div>
      <div class="weather">
          <div>
              <img src="${iconurl}"
              <div class="temp">${temp}°F</div>
          </div>
      </div>
      <div class="wind-speed">${windSpeed}</div>
      <div class="uvi"></div>
  </div>`;
}

const tester = async () => {

  // Gets city name and replaces spaces with "%20" for url parsing
  let city = search()
  let CITY = city.replace(' ', '%20');
  CITY_GEOCODE_URL = GEOCODE_URL + CITY


  // Get city data location data
  const cityData = await getData(CITY_GEOCODE_URL, GEOCODE_HOST);
  let CITY_LAT = cityData[0].lat
  let CITY_LONG = cityData[0].lon


  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(`https://api.openweathermap.org/data/2.5/onecall?appid=b3041596dbecb7fc61c1d4b91298ae63&lat=${CITY_LAT}&lon=${CITY_LONG}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));



}

function checkFavorites() {
  for (i = 0; i < breweryFavorites.length; i++) {
    if (breweryId === breweryFavorites[i]) { //if the brewery is already in local storage, the button will say 'Favorite'
      console.log("running")
      breweryFavBtn.textContent = "Favorite";
      var hearticon = document.createElement("img");
      hearticon.setAttribute("id", "heart-icon");
      hearticon.setAttribute("src", "../Images/heart-icon.png")
      breweryFavBtn.appendChild(hearticon);
      var isFavorite = true
    } else {
      console.log("Id not in local storage")
      isFavorite = false
    }
  }
  return isFavorite; //tells the function for the event listener that the brewery is a favorite
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ACTION 

// BUTTON ELEMENT ACTION | Change the event listener to `click` to make the event trigger on single-click
// submitBtnEl.addEventListener('click', tester);
submitBtnEl.addEventListener('click', querySearcher);
// submitBtnEl.addEventListener('click', populateStorage);