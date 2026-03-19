import { Position, RawSensorHistory } from "../../interfaces/vehicle.types";
import { SensorHistory } from './sensorHistory';


export abstract class Sensor{
    protected history: SensorHistory[] = [];

    constructor(
        public id: number,
        public type: string,
        rawHistory: RawSensorHistory[] = []
    ) {
        this.history = rawHistory.map(h => new SensorHistory(h.timestamp, h.value));
    }

    
    addRecord(timestamp: string, value: number | Position){
        this.history.push(new SensorHistory(timestamp, value));
    }

    getHistory() {
        return this.history;
    }
    
    // Récupère la dernière donnée brute
    protected getLastRecord(): SensorHistory | null {
        return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    }

    // Récupère la dernière valeur enregistrée
    getLastValue() {
        return this.history.length > 0 ? this.history[this.history.length - 1].value : null;
    }
}