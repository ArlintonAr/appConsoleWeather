import { inquirerMenu, pause, readInput,listsPlaces} from "./helpers/inquirer.js"
import { Searchs } from "./models/searchs.js"
import 'dotenv/config' //consumiendo el paquete "DOTENV" para consumir la API KEY desde el entorno de variables


const main = async () => {

    const searchs= new Searchs()
    let opt

    do {
         opt = await inquirerMenu()
       
        switch (opt) {
            case 1:
                //Mostrar mensaje
                    const termPlace= await readInput('Ciudad: ') 
  
                    //Buscar los lugares
                    const places= await searchs.city(termPlace)
                    
                    //Selecciono lugar
                    const id= await listsPlaces(places) 

                    if (id==='0')continue
    
                    const placeSelect=places.find(p=> p.id===id )
                    //guardar en db
                    searchs.addHistory(placeSelect.name)

                //Clima
                  const dataWeather= await searchs.weather(placeSelect.lat,placeSelect.lng)
              

                //Mostrar Resultados
                console.clear()
                console.log("\nInformacion de la ciudad\n".green)
                console.log('Ciudad: ',placeSelect.name)
                console.log('Lat: ',placeSelect.lat )
                console.log('Lng: ', placeSelect.lng)
                console.log('Temperatura: ',dataWeather.temp ,' C°')
                console.log('Mínima: ', dataWeather.min ,' C°')
                console.log('Máxima: ',dataWeather.max ,' C°')
                console.log('El clima está con: ',dataWeather.desc.green )
                break;
        
            case 2:
                searchs.histrialCapitalize.forEach((place,i)=>{
             
                    const idx=`${i+1}`.green
                    console.log(`${idx} ${place}`)
                })
        }

        if (opt !== 0) await pause()
    } while (!opt == 0)

}

main()