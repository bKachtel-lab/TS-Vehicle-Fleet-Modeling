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

    // On mets du carburant
    refillFuel(level: number): void {
        // On s'assure que le niveau est entre 0 et 100
    const safeLevel = Math.min(100, Math.max(0, level));
    
    const fuelSensor = this.getSensor('Fuel');
    if (fuelSensor) {
        fuelSensor.addRecord(new Date().toISOString(), safeLevel);
        console.log(`Réservoir rempli à ${safeLevel}%`);
    }
    }


}