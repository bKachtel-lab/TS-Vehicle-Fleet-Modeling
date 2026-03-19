import { Sensor } from './sensor';

export class BatterySensor extends Sensor {
    getBatteryLevel(): number {
        const last = this.getLastRecord();
        return last ? (last.value as number) : 0;
    }
}