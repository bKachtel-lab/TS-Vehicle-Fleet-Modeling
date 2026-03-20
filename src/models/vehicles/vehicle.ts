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

    //Ajoute un capteur 
    addSensor(sensor:Sensor): void{
        const exists = this.sensors.find(s => s.id === sensor.id);
        if(!exists){
            this.sensors.push(sensor);
        }
    }

    //Supprime un capteur par son ID
    removeSensor(sensorId: number): void{
        this.sensors = this.sensors.filter(s => s.id !== sensorId);
        
    }
}