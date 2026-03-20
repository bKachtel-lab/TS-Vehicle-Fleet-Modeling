import { Vehicle } from './vehicle';
import { Sensor } from '../sensors/sensor';
import { FuelLevelSensor } from '../sensors/fuelLevelSensor';

export class Car extends Vehicle{
    constructor(
        id: number,
        brand: string,
        model: string,
        year: number,
        public fuelType: string,
        sensors: Sensor[] = []
    ) {
        super(id, brand, model, year, sensors);
    }

    //Retourne le niveau de carburant
    getFuelLevel(): number {
        const sensor = this.getSensor('Fuel');
        if(sensor instanceof FuelLevelSensor){
            return sensor.getFuelLevel();
        }
        return 0;
    }
    

}