import { Sensor } from './sensor';

export class BatterySensor extends Sensor {
    getBatteryLevel(): number {
        const last = this.getLastRecord();
        return last ? (last.value as number) : 0;
    }

    //Calcul de la vitesse de decharge
    gitDischargeRate() : number{
        const evolution = this.getEvolution();
        return evolution < 0? Math.abs(evolution) :0;
    }
}