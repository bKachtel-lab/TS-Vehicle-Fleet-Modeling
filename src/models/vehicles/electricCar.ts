import { Vehicle } from './vehicle';
import { Sensor } from '../sensors/sensor';
import { BatterySensor } from '../sensors/batterySensor';

export class ElectricCar extends Vehicle {
    constructor(
        id: number,
        brand: string,
        model: string,
        year: number,
        public batteryCapacity: number,
        sensors: Sensor[] = []
    ) {
        super(id, brand, model, year, sensors);
    }

    //Récupere le % de batterie
    getBatteryStatus(): number {
        const sensor = this.getSensor('Battery');
        if(sensor instanceof BatterySensor){
            return sensor.getBatteryLevel();
        }
        return 0;
    }

    //Calcule l'autonomie théorique restante (ex: 5km par kWh)
    getEstimatedRange(kmPerKwh: number = 5): number {
        const remainingKwh = (this.batteryCapacity * this.getBatteryStatus()) / 100;
        return kmPerKwh*remainingKwh;
    }
}