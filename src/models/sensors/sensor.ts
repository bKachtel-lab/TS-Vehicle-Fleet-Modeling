import { Position, RawSensorHistory } from "../../interfaces/vehicle.types";

export abstract class Sensor{
    constructor(
        public id: number,
        public type: string,
        protected history: RawSensorHistory[] = []
    ) {}

    addRecord(timestamp: string, value: number | Position){
        this.history.push({timestamp, value});
    }

    getHistory() {
        return this.history;
    }
    
    // Récupère la dernière donnée brute
    protected getLastRecord(): RawSensorHistory | null {
        return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    }

    // Récupère la dernière valeur enregistrée
    getLastValue() {
        return this.history.length > 0 ? this.history[this.history.length - 1].value : null;
    }
}