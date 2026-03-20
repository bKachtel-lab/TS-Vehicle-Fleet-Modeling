export const version = () => '0.0.1';
import { promises as fs } from 'fs';
import { Truck } from './models/vehicles/truck';
import { Car } from './models/vehicles/car';
import { Bike } from './models/vehicles/bike';
import { VehicleFactory } from './services/vehicleFactory';
import { ElectricCar } from './models/vehicles/electricCar';
import {Vehicle} from './models/vehicles/vehicle'
import { LoadSensor } from './models/sensors/loadSensor';
async function main(){
    try{
        //1. lire le fichier JSON
        const rawData = await fs.readFile('./resources/test_data.json', 'utf-8');
        const jsonContent = JSON.parse(rawData);

        //2. Utiliser la factory pour transformer le JSON en instances de classes
        const fleet = VehicleFactory.createFleet(jsonContent);
        console.log(` ${fleet.length} véhicules chargés avec succès.\n`);

        //3. Démonstration
        simulateActivity(fleet);

        //4. Affichage du rapport global
        fleet.forEach((vehicle : Vehicle) => {
            printVehicleReport(vehicle);
        });
            console.log(`-----------------------------------------------------------`);
        
    } catch(error){
        console.error("Erreur lors du lancement de l'application :");
        if (error instanceof Error) {
            console.error(error.message);
        }
    }   
}

/**
 * Simule des événement réels sur les véhicules
 * @param fleet tab de véhicules
 */
function simulateActivity(fleet: Vehicle[]){
    const now = new Date().toISOString();

    fleet.forEach(v => {
        //tout le monde accélere un peu 
        const speedSensor = v.getSensor('Speed');
        const loadSensor = v.getSensor('Load');
        
        if(speedSensor) speedSensor.addRecord(now, Math.floor(Math.random() * 50) + 20);
        if(loadSensor) loadSensor.addRecord(now, 80);
        //Action spécifiques
        //  Car
        if(v instanceof Car) v.refillFuel(95); //On fait le plein à 95%

        //ElectricCar
        if(v instanceof ElectricCar) v.chargeBattery(100);

        // Truck
        if(v instanceof Truck) v.setLoad(1000);

    })
}

//Fonction pour ecrire les rapports de chaque vehicules
function printVehicleReport(v: Vehicle) {
    console.log(`--- [${v.constructor.name.toUpperCase()}] ID: ${v.id} ---`);
    console.log(`Modèle : ${v.brand} ${v.model} (${v.year})`);
    console.log(`Vitesse Moyenne : ${v.getAverageSpeed().toFixed(2)} km/h`);

    //Utilisation des nouvelles stats du Sensor
    const speedSensor = v.getSensor('Speed');
    if(speedSensor){
        console.log(`Vitesse Max enregistrée : ${speedSensor.getMaxValue()} km/h`);
    }

    // Si c'est un Truck
    if(v instanceof Truck){
        console.log(`Charge : ${v.getLoadRate().toFixed(2)}% (Max : ${v.maxLoad})`);

    }

    //Si c'est une voiture electrique
    if( v instanceof ElectricCar){
        console.log(`Batterie : ${v.getBatteryStatus()}%`);
        console.log(`Autonokie estimée : ${v.getEstimatedRange()} km`);
    }

    console.log(`-----------------------------------------------------------\n`);
}

// On lance la simulation
main();