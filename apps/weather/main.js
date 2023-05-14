import { WGM } from "../../windowManager/WGM/WGM.js"

export class WeatherWGM {
    constructor(canvas, assetManager){
        this.canvas = canvas
        this.assetManager = assetManager

        this.WGM = new WGM(this.assetManager.assets.Layouts.weather,this.canvas)
        this.WGM.selectedContext = 0
        fetch("https://api.openweathermap.org/data/2.5/weather?id=763523&appid=5ba1773002f33d4cb054bc3f6e558e66").then((response) => {
            return response.json()
        }).then((data) => {
            this.weatherData = data
        })
    }

    draw(){
        if(!this.weatherData){
            // maybe print that it is updating currently
            this.WGM.selectedContext = 0
            this.WGM.draw()
            return
        }
        this.WGM.selectContextByID("main_context")
        this.WGM.getByID("city").content = this.weatherData.name
        this.WGM.getByID("temperature").content = parseFloat(parseFloat(this.weatherData.main.temp - 273.15).toFixed(2)) + "°"
        this.WGM.getByID("description").content = this.weatherData.weather[0].description
        this.WGM.getByID("feels").content =  "Feels like: " + parseFloat(parseFloat(this.weatherData.main.feels_like - 273.15).toFixed(2)) + "°"
        this.WGM.getByID("humidity").content = "Humidity: " + this.weatherData.main.humidity + "%"
        console.log("weather/icons/" + this.weatherData.weather[0].icon.substring(0,2) + ".png")
        this.WGM.getByID("icon").src = "weather/icons/" + this.weatherData.weather[0].icon.substring(0,2) + ".png"
        this.WGM.getByID("icon").reloadImg()
        this.WGM.draw()
    }

    destroy(){
        console.log("Bye From weather")
    }
}