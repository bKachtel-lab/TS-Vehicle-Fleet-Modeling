import { Vehicle } from './vehicle';
import { Sensor } from '../sensors/sensor';
import { LoadSensor } from '../sensors/loadSensor';

export class Truck extends Vehicle  {

    constructor(
        id: number,
        brand: string,
        model: string,
        year: number,
        public maxLoad: number,
        sensors: Sensor[] = []
    ){
        super(id, brand, model, year, sensors);
    }

    // Récupère la charge actuelle (valeur brute du capteur)
    getCurrentLoad(): number{
        const sensor = this.getSensor('Load')
        if(sensor instanceof LoadSensor){
            return sensor.getLoad();
        }
        return 0;
    }

    //calcul le taux de remplissage en %
    getLoadRate() : number {
        if(this.maxLoad === 0) return 0;
        return (this.getCurrentLoad() / this.maxLoad) * 100;
    }

    //Vérifie si le camion est en surcharge
    isOverLoad(): boolean {
        return this.getCurrentLoad() >= this.maxLoad;
    }

}
