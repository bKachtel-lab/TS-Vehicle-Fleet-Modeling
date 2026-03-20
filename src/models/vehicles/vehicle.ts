import { Position } from "../../interfaces/vehicle.types";
import { Sensor } from "../sensors/sensor";
import { SpeedSensor } from '../sensors/speedSensor';

export abstract class Vehicle {
    constructor(
        public id: number,
        public brand: string,
        public model: string,
        public year: number,
        protected sensors: Sensor[] = []
    ) {}
    
    //methode pour récupérer un capteur spécifique par son type
    getSensor(type: string): Sensor | undefined{
        return this.sensors.find(s => s.type === type);
    }

    //Retourne tous les capteurs
    getSensors(): Sensor[] {
        return this.sensors;
    }

    //Supprime un capteur par son ID
    removeSensor(sensorId: number): void{
        this.sensors = this.sensors.filter(s => s.id !== sensorId);

    }

    // Méthode commune : tout véhicule peut tenter de donner sa vitesse
    getAverageSpeed(): number {
        const sensor = this.getSensor('Speed');
        if (sensor instanceof SpeedSensor) {
            return sensor.getAverageSpeed();
        }
        return 0; // Pas de capteur de vitesse = 0 km/h
    }

}