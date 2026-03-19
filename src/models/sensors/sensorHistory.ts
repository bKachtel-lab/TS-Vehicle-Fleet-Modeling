import { time } from 'node:console';
import { Position } from '../../interfaces/vehicle.types';

export class SensorHistory{
    public timestamp: Date; //On transforme le string en vrai objet Date
    public value: number | Position;

    constructor(timestamp: string, value: number | Position){
        this.timestamp = new Date(timestamp);
        this.value = value;
    }

    // Une méthode utile pour les tests
    getFormattedDate(): string {
        return this.timestamp.toLocaleString('fr-FR');
    }

    // Utile pour savoir si c'est un nombre ou un GPS
    isNumeric(): boolean {
        return typeof this.value === 'number';
    }
}