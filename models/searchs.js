import axios from "axios"
import fs from 'fs'

class Searchs {
    historial = []
    dbPath = './db/database.json'

    constructor() {
        //TODO: Leer mi BD si existe
        return this.readBD()
    }

    get returnParams() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'

        }
    }

    get returnParamsWeather() {
        return {
            'appid': process.env.WEATHER_KEY,
            'lang': 'es',
            'units': 'metric'
        }
    }
    get histrialCapitalize() {
        return this.historial.map(place => {
            let words = place.split(' ')
            words = words.map(w => w[0].toUpperCase() + w.substring(1))
            return words.join(' ')
        })
    }
    async city(place = '') {
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.returnParams
            })
            const resp = await instance.get()
            return resp.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }))


        } catch (error) {
            return error
        }
    }

    async weather(lat, lon) {
        try {

            //peticion http openWeather
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.returnParamsWeather
            })

            const resp = await instance.get()

            return {
                desc: resp.data.weather[0].description,
                temp: resp.data.main.temp,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max
            }


        } catch (error) {
            return error
        }
    }

    addHistory(place = '') {
        //TODO:prevenir duplicados
        if (this.historial.includes(place.toLocaleLowerCase())) {
            return
        }
        this.historial=this.historial.splice(0,5) //para mantener 6 en mi historial
        this.historial.unshift(place.toLocaleLowerCase())
        //Grabar en DB
        this.saveDB()
    }

    saveDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readBD() {
        if (!fs.existsSync(this.dbPath)) return
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(info)

        this.historial = data.historial
    }

}


export { Searchs }