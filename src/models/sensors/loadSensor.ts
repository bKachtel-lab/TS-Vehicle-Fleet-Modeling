import { Sensor } from './sensor';

export class LoadSensor extends Sensor {
    getLoad(): number {
        const last = this.getLastRecord();
        return last ? (last.value as number) : 0;
    }
}