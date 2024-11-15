const cityLocation = document.querySelector('.location-input')
const searchbtn = document.querySelector('.search-btn')


const cityname = document.querySelector('.cityName')
const tempO = document.querySelector('.tempC')
const tempmax = document.querySelector('.high')
const tempmin = document.querySelector('.low')
const tempFeels = document.querySelector('.feelsLike')
const tempSky = document.querySelector('.sky')
const WindSpeed = document.querySelector('.speedValue')
const humid = document.querySelector('.humid-ity')
const press = document.querySelector('.pressure')
const visib = document.querySelector('.visib-ility')

const weatherImg = document.querySelector('.weatherImage');



// 10-day//
const forecastItemContainer = document.querySelector('.ten-day');

//hourly //
const hourlyContainer = document.querySelector('.hourly');


const apiKey = '47b7bc3d24a3840dbbee7e5eeba18830'
searchbtn.addEventListener('click', () =>{
  if(cityLocation.value.trim() !=''){
    weatherInfoData(cityLocation.value)
    forecastInfoData(cityLocation.value)
    console.log(cityLocation.value)
    cityLocation.value = ''
    cityLocation.blur()
  }
})

cityLocation.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' &&
        cityLocation.value.trim() !=''
    ){
        weatherInfoData(cityLocation.value)
        forecastInfoData(cityLocation.value)
        console.log(cityLocation.value)
        cityLocation.value = ''
        cityLocation.blur()  
    }
})



async function getFetchData(endPoint , city){
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

  const response = await fetch(apiUrl) 

  return response.json()
}

async function weatherInfoData(city){
    let weatherData = await getFetchData('weather' ,city)
        console.log(weatherData)

    const{
        name: country,
        main: {temp ,temp_max ,temp_min ,feels_like,humidity,pressure},
        weather: [{id,main}],
        wind: {speed},
        visibility

        
    }    = weatherData

   

    cityname.textContent = country
    tempO.textContent =  Math.round(temp) + '°C'
    tempmax.textContent = Math.round(temp_max) + '°C'
    tempmax.textContent = Math.round(temp_min) + "°C"
    tempFeels.textContent = 'Feels like:' + Math.round(feels_like) + '°C'
    tempSky.textContent = main
    WindSpeed.textContent = speed + "M/S"
    humid.textContent = humidity + "%"
    press.textContent = pressure + 'hPa'
    visib.textContent = (visibility / 1000).toFixed(1) + ' km'
    
    weatherImg.src = `${getWeathericon(id)}`
}

function getWeathericon(id){
    if(id <= 232) return 'thunderstorm.png'
    if(id <= 531) return 'light-rain.png'
    if(id == 800) return 'contrast.png'
    if(id == 721) return 'haze.png'
    if(id == 741) return 'foggy.png'
    if(id <= 804) return 'foggy.png'

    else return 'partly cloudy.png'
    }


async function forecastInfoData(city){
    hourlyContainer.innerHTML = '';
    forecastItemContainer.innerHTML = '';
    let forecastData = await getFetchData('forecast' ,city)
    console.log(forecastData)
        const timeTaken = '12:00:00'
        const today = new Date().toISOString().split('T')[0]
        forecastData.list.forEach(forecastWeather =>{ 
            if(forecastWeather.dt_txt.includes(timeTaken)&&
        !forecastWeather.dt_txt.includes(today))
            updateForecast(forecastWeather)
    })
    forecastData.list.slice(0,8).forEach(hourData=> {
        updateHourlyForecast(hourData)
    })
}

function updateHourlyForecast(weatherData) {
    const {
      dt,
      main: { temp },
      weather: [{ id }],
    } = weatherData;


const hourlyItem = `
    <div class="hourly-1">
      <h5 class="hourlyTemp">${Math.round(temp)}°</h5>
      <img src="${getWeathericon(id)}" class="hourlyImg">
      <h5 class="hourlyTime">${formatTime(dt)}</h5>
    </div>`

  hourlyContainer.insertAdjacentHTML('beforeend', hourlyItem);
  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}}


function updateForecast(weatherData){
    console.log(weatherData)
    const{
        dt_txt: date,
        main: {temp_max,temp_min,},
        weather:[{id}]

    } = weatherData
 
    const dateObj = new Date(date)
    const options = { day: 'numeric', month: 'short' }
    const formattedDate = dateObj.toLocaleDateString('en-US', options)

    const forecastItem = `
            <div class="forDate">
                <h4 class="date">${formattedDate}</h4>
                <img src="${getWeathericon(id)}" class="weatherImage">
                <h4 class="tempDetail">${Math.round(temp_max)}°C</h4>
            </div>`

    forecastItemContainer.insertAdjacentHTML('beforeend',forecastItem)        
    
    

}


  





