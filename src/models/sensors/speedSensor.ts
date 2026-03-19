import {Sensor} from './sensor'

export class SpeedSensor extends Sensor {
    getSpeed() : number {
        const last = this.getLastRecord();
        return last ? (last.value as number) : 0;
    }

    getAverageSpeed(): number {
        if(this.history.length === 0) return 0;
        const sum = this.history.reduce((acc, curr) => acc + (curr.value as number), 0);
        return sum / this.history.length;
    }
}