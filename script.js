const accessKey = "08e00db9b38b8b1a73c92e885e09eb11";

const searchBar = document.querySelector(".search");
const searchInput = document.getElementById("search-input");

// Div location to update value based on city
const locationNameDiv = document.getElementById("location");
const tempDiv = document.getElementById("temp");
const weatherIconDiv = document.getElementById("weather-icon");
const weatherCondDiv = document.getElementById("condition");

const windDiv = document.getElementById("wind-value");
const visDiv = document.getElementById("visibility-value");
const humidityDiv = document.getElementById("humidity-value");
const sunRiseDiv = document.getElementById("sunrise-value");
const sunSetDiv = document.getElementById("sunset-value");

const backgroundDiv = document.getElementById("background");
// ---

// store user input to search city
let inputValue = "";

// search city based on user input and display its weather forcast
async function searchCity() {
  inputValue = searchInput.value;

  //fetch api response
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${accessKey}&units=metric`;

  const response = await fetch(url);

  if (response.ok) {
    const jsonResponse = await response.json(); // convert to json format

    // store important info from json response to display on the website
    const location = jsonResponse.name + ", " + jsonResponse.sys.country;
    const tempValue = Math.round(jsonResponse.main.temp);
    const weatherCondition = jsonResponse.weather[0].main;
    const weatherIcon = jsonResponse.weather[0].icon;

    const wind = Math.round(jsonResponse.wind.speed * 3.6); // answer in km/h
    const visibility = Math.round(jsonResponse.visibility / 1000); // answer in kilometer
    const humidity = jsonResponse.main.humidity;
    const sunrise = new Date(jsonResponse.sys.sunrise * 1000);
    const sunset = new Date(jsonResponse.sys.sunset * 1000);

    // update forcast values
    locationNameDiv.textContent = location;
    tempDiv.textContent = tempValue + "°C";
    weatherCondDiv.textContent = weatherCondition;
    weatherIconDiv.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

    windDiv.textContent = wind + " km/h";
    visDiv.textContent = visibility + " km";
    humidityDiv.textContent = humidity + "%";

    sunRiseDiv.textContent = sunrise.toLocaleTimeString();
    sunSetDiv.textContent = sunset.toLocaleTimeString();

    if (weatherIcon[2] === "d") {
      backgroundDiv.style.backgroundImage =
        "url('./background/mountains-sunset.jpg')";
    } else {
      backgroundDiv.style.backgroundImage =
        "url('./background/mountains-night.jpg')";
    }
  } else {
    alert("Check spelling of the city!! \nTry again.");
  }
}

const searchResult = document.getElementById("search-list");
const MAX_CITY_TO_DISPLAY = 15;
let currCityNumber = 0;

// display city suggestion as user types their input for city
searchInput.oninput = function () {
  let result = [];
  let searchValue = searchInput.value.toLowerCase();
  searchResult.innerHTML = "";
  currCityNumber = 0;

  if (searchValue.length > 1) {
    // Filter cities based on user input
    result = cityNameList.filter((city) => {
      const cityName = city.name.toLowerCase();
      return cityName.includes(searchValue);
    });

    searchResult.style.display = "block";

    // Display only top 15 results
    while (
      currCityNumber < result.length &&
      currCityNumber < MAX_CITY_TO_DISPLAY
    ) {
      searchResult.innerHTML +=
        "<li onclick=selectInput(this)>" +
        result[currCityNumber].name +
        ", " +
        result[currCityNumber].country +
        "</li>";
      currCityNumber++;
    }
  }
};

// returns list of city that matches user input
function getResult(searchValue) {
  let results = cityList.filter((city) => {
    return city.toLowerCase().includes(searchValue);
  });

  return results;
}

// search city forcast when user clicks on any search suggestion city
function selectInput(searchItem) {
  searchInput.value = searchItem.innerHTML;
  searchResult.innerHTML = ""; //empty the suggestion list after user click
  searchCity();
}

// Event listener for the Enter key on search box
searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    searchCity();
  }
});
