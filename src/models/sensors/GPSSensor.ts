import { Sensor } from './sensor';
import { Position } from '../../interfaces/vehicle.types';

export class GPSSensor extends Sensor {
    getLocation(): Position | null {
        const last = this.getLastRecord();
        return last ? (last.value as Position) : null;
    }
}