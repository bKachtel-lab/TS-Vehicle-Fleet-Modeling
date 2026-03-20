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

    // On recharge la batterie
    chargeBattery(level: number): void {
        const safeLevel = Math.min(100, Math.max(0,level));

        const batterySensor = this.getSensor('Battery');
        if (batterySensor) {
        batterySensor.addRecord(new Date().toISOString(), safeLevel);
        console.log(`Batterie chargée à ${safeLevel}%`);
    }
    }
}