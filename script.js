console.log('script.js works!');
const API_KEY = '35afe7a7ae9754df6dcc7aee2d0b870a';

let date = new Date();
console.log("current date", date.valueOf());

let navbar_brand = document.querySelector('header > nav span._current-day');
navbar_brand.innerHTML = date.toLocaleString();

let coords;
let weather_data;

class Day {
  name;
  morning;
  middey;
  evening;

  constructor(_morning, _middey, _evening) {
    this.name = this.setName(new Date(_morning.dt_txt).getDay());
    this.morning = _morning;
    this.middey = _middey;
    this.evening = _evening;
  }

  setName(inter) {
    let str = "";
    switch (inter) {
      case 1:
        str = "Monday"
        break;
      case 2:
        str = "Tuesday"
        break;
      case 3:
        str = "Wednesday"
        break;
      case 4:
        str = "Thursday"
        break;
      case 5:
        str = "Friday"
        break;
      case 6:
        str = "Sunday"
        break;
      case 0:
        str = "Saturday"
        break;
      default:
        str = "Wtf?"
        break;
    }
    return str;
  }
}

if (navigator.geolocation) {
  // navigator.geolocation.getCurrentPosition(getWeatherByPosition);
  navigator.geolocation.getCurrentPosition(getForecastByPosition, errorPos);
}

function errorPos(positionErr) {
  console.error(positionErr);
};

function getWeatherByPosition(position) {
  console.log(position);
  coords = position.coords;

  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`)
    .then(data => data.json())
    .then(resultats => {
      weather_data = resultats;
      console.log(weather_data);

      return setWeather(weather_data);
    })
    .catch(err => console.error(err))

  // Ce tableau n affichera rien car il est en synchrone avec le fetch
  // qui lui met du temps pour repondre car appel a l'api
  // console.log(weather_data)

  // En XMLHttpRequest (remplacer par fetch)
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=London&mode=json", false);
  // xhr.send();
  // var data= JSON.parse(xhr.responseText); //data is now a javascript object full of the API data
}

function setWeather(data) {
  let deg = document.querySelector("._deg");
  let weather = document.querySelector("._weather");
  let humidity = document.querySelector("._humidity");
  let wind = document.querySelector("._wind");
  let location = document.querySelector('._location');

  deg.innerHTML = Math.round(data.main.temp - 273.15);
  weather.innerHTML = data.weather[0].description;
  humidity.innerHTML = data.main.humidity;
  wind.innerHTML = data.wind.speed * 3.6;
  location.innerHTML = data.name;
}

function getForecastByPosition(position) {
  console.log(position);
  coords = position.coords;

  fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`)
    .then(data => data.json())
    .then(resultats => {
      forecast_data = resultats;
      console.log(forecast_data);

      return setForecast(forecast_data);
    })
    .catch(err => console.error(err))
}

function setForecast(data) {
  setForecastForCurrentDay(data);
  setForecastForNextDays(data);
}

function setForecastForCurrentDay(data) {
  // select html element
  let deg = document.querySelector("._deg");
  let weather = document.querySelector("._weather");
  let humidity = document.querySelector("._humidity");
  let wind = document.querySelector("._wind");
  let location = document.querySelector('._location');

  // set value of current day
  deg.innerHTML = Math.round(data.list[0].main.temp - 273.15);
  weather.innerHTML = data.list[0].weather[0].description;
  humidity.innerHTML = data.list[0].main.humidity;
  wind.innerHTML = Math.round(data.list[0].wind.speed * 3.6);
  location.innerHTML = data.city.name;
}

function setForecastForNextDays(data) {
  let filtered_data = [];
  // increment filtered_data
  data.list.forEach(element => {
    // condition for increment
    if (new Date(element.dt_txt).getDay() !== date.getDay()) {
      if (
        new Date(element.dt_txt).getHours() === 6 ||
        new Date(element.dt_txt).getHours() === 12 ||
        new Date(element.dt_txt).getHours() === 18) {
        filtered_data.push(element);
      }
    }
  });

  // API returns the following 5 days
  let next_day_tab = [
    // new Day(morning, midday, evening);
    new Day(filtered_data[0], filtered_data[1], filtered_data[2]),
    new Day(filtered_data[3], filtered_data[4], filtered_data[5]),
    new Day(filtered_data[6], filtered_data[7], filtered_data[8]),
    new Day(filtered_data[9], filtered_data[10], filtered_data[11]),
    new Day(filtered_data[12], filtered_data[13], filtered_data[14])
  ];

  let table_body = document.querySelector('._next-day table > tbody');
  table_body.innerHTML = "No content";
  let html = "";

  // increment html string
  next_day_tab.forEach(day => {
    html += `
      <tr>
        <th class="" scope="row">${day.name}</th>
        <td>${Math.round(day.middey.main.temp - 273.15)}°</td>
        <td>
          <img src="icons/${day.middey.weather[0].icon}.png" width="30" height="30" alt="icon"/>
          </td>
      </tr>
    `;
  });

  // increment table_body with html
  table_body.innerHTML = html;
}

// select refresh button
let refresh_btn = document.querySelector('button._refresh-btn');
// and add event on click for refresh page
refresh_btn.addEventListener('click', () => {
  document.location.reload();
})