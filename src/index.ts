import { promises as fs } from 'fs';
import { Truck } from './models/vehicles/truck';
import { VehicleFactory } from './services/vehicleFactory';
import { ElectricCar } from './models/vehicles/electricCar';
import {Vehicle} from './models/vehicles/vehicle'
async function main(){
    try{
        //1. lire le fichier JSON
        const rawData = await fs.readFile('./resources/test_data.json', 'utf-8');
        const jsonContent = JSON.parse(rawData);

        //2. Utiliser la factory pour transformer le JSON en instances de classes
        const fleet = VehicleFactory.createFleet(jsonContent);

        //3. Démonstration 
        fleet.forEach(vehicle => {
            console.log(`--- [${vehicle.constructor.name}] ${vehicle.brand} ${vehicle.model}`)

            //Vitesse moyenne pour tous les vehicules
            console.log(`Vitesse moyenne : ${vehicle.getAverageSpeed()} km/h`)

            //Logique spécifique selon le type 
            if(vehicle instanceof Truck){
                console.log(`Charge actuelle: ${vehicle.getLoadRate().toFixed(2)}% de la capacité (${vehicle.maxLoad} kg).`);
            }

            if(vehicle instanceof ElectricCar){
                console.log(`Niveau batterie : ${vehicle.getBatteryStatus()}%`);
                console.log(` Autonomie estimé : ${vehicle.getEstimatedRange()} km`);
            }

            console.log(`-----------------------------------------------------------`)
        });
    } catch(error){
        console.error("Erreur lors du lancement de l'application :");
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}

main();