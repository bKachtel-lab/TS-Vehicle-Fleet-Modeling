import { Sensor } from "../sensors/sensor";

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
}