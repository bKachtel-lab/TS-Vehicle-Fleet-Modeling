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

    //Ajoute une nouvelle mesure
    addRecord(timestamp: string, value: number | Position){
        this.history.push(new SensorHistory(timestamp, value));
    }

    // Retourne tout l'historique 
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

    // Renvoie QUE des nombres pour les calculs
    getNumericValues(): number[] {
        return this.history
            .map(h => h.value)
            .filter((v): v is number => typeof v === 'number');
    }

    // Calcule la moyenne des valeurs numeriques de l'historique
    getAverage(): number {

        const values = this.getNumericValues();
        if(values.length === 0 ) return 0;

        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }    

    //Retourne le max
    getMaxValue() : number{
        const values = this.getNumericValues();
        if(values.length === 0) return 0;
        return Math.max(...values);
    }
    
    //Calcul de l'évolution (différence entre première et dernière valeur)
    getEvolution(): number{
        
        const values = this.getNumericValues();

        if(values.length < 2  ) return 0;
 
        return values[values.length -1] - values[0];
    }
}