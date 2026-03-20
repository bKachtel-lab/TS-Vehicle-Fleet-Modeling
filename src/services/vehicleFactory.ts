// src/services/vehicle-factory.ts
import { RawVehicleData, RawSensorData } from '../interfaces/vehicle.types';
import { Vehicle } from '../models/vehicles/vehicle';
import { Truck } from '../models/vehicles/truck';
import { Car } from '../models/vehicles/car';
import { ElectricCar } from '../models/vehicles/electricCar';
import { Bike } from '../models/vehicles/bike';

// Imports des capteurs
import { Sensor } from '../models/sensors/sensor';
import { SpeedSensor } from '../models/sensors/speedSensor';
import { GPSSensor } from '../models/sensors/GPSSensor';
import { BatterySensor } from '../models/sensors/batterySensor';
import { FuelLevelSensor } from '../models/sensors/fuelLevelSensor';
import { LoadSensor } from '../models/sensors/loadSensor';

export class VehicleFactory{

    /**
     * Point d'entrée : transforme un tableau JSON en une flotte de vehicules
     */

    static createFleet(data : RawVehicleData[]): Vehicle[] {
        return data.map(v => this.createVehicle(v))
    }

    /**
     * Crée un vehicule spécifique selon son type
     */

    private static createVehicle(v: RawVehicleData): Vehicle {
        //On crée d'abord la liste des instances de capterus
        const sensors = v.sensors.map(s => this.createSensor(s));

        switch(v.type) {
            case 'Truck' : 
                    return new Truck(v.id, v.brand, v.model, v.year, v.maxLoad || 0, sensors);
            case 'Car' : 
                    return new Car(v.id, v.brand, v.model, v.year, v.fuelType || 'unknown', sensors);
            case 'ElectricCar' : 
                    return new ElectricCar(v.id, v.brand, v.model, v.year, v.batteryCapacity || 0, sensors);                
            case 'Bike' : 
                    return new Bike(v.id, v.brand, v.model, v.year, v.bikeType || 'standard', sensors);         
            default: 
                throw new Error(`Type de véhicule non géré : ${v.type}`);
        }
    }

    /**
     * Crée un capteur spécifique selon son type
     */

    private static createSensor(s: RawSensorData): Sensor{
        switch(s.type) {
            case 'Speed':
                return new SpeedSensor(s.id, s.type, s.history);
            case 'GPS':
                return new GPSSensor(s.id, s.type, s.history);
            case 'Battery':
                return new BatterySensor(s.id, s.type, s.history);
            case 'Fuel':
                return new FuelLevelSensor(s.id, s.type, s.history);     
            case 'Load':
                return new LoadSensor(s.id, s.type, s.history);
            default: 
                //Si type inconnu
                throw new Error(`Type de capteur non géré : ${s.type}`);
        
        }
    }
}