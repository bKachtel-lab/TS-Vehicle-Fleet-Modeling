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

    //Ajoute un nouveau capteur ou remplace l'ancien 
    addAndReplaceSensor(sensor:Sensor): void{
        const index = this.sensors.findIndex(s => s.id === sensor.id);
        if(index !== -1){
            this.sensors[index] = sensor;
        }
        this.sensors.push(sensor);
    }

    //Supprime un capteur par son ID
    removeSensor(sensorId: number): void{
        this.sensors = this.sensors.filter(s => s.id !== sensorId);

    }

}