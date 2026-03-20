import { Vehicle } from './vehicle';

export class Bike extends Vehicle {
    constructor(
        id: number,
        brand: string, 
        model: string, 
        year: number, 
        public bikeType: 
        string, sensors: any[] = []
    ) {
        super(id, brand, model, year, sensors);
    }
}