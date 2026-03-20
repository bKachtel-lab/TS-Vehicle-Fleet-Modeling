export interface Position{
    lat: number;
    lon: number;
}

export interface RawSensorHistory{
    timestamp: string;
    value: number | Position;
}

export interface RawSensorData{
    id: number;
    type: 'GPS' | 'Speed' | 'Fuel' | 'Load' | 'Battery';
    history: RawSensorHistory[];
}

export interface RawVehicleData{
    id: number;
    brand: string;
    model: string;
    year: number;
    type: string;
    sensors: RawSensorData[];
    //Proprietés spécifiques selon le type
    fuelType?: string;
    batteryCapacity?: number;
    maxLoad?: number;
    bikeType?: string;
}