import { Sensor } from './sensor';

export class FuelLevelSensor extends Sensor {
    getFuelLevel(): number {
        const last = this.getLastRecord();
        return last ? (last.value as number) : 0;
    }
}