import { promises as fs } from 'fs';
import { beforeAll, describe, expect, test } from 'vitest';

import { version } from './index';

//imports 
import { Truck } from '../src/models/vehicles/truck';
import { ElectricCar } from '../src/models/vehicles/electricCar';
import { SpeedSensor } from '../src/models/sensors/speedSensor';
import { LoadSensor } from '../src/models/sensors/loadSensor';
import { BatterySensor } from '../src/models/sensors/batterySensor';
import { VehicleFactory } from './services/vehicleFactory';
let data : any;
beforeAll(async () => {
  data = await fs.readFile('./resources/test_data.json', {
    encoding: 'utf8',
  });
  data = JSON.parse(data);
});

describe('Sensor model tests', () => {
  describe('Dummy tests', () => {
    test('data is loaded with 3 elements', () => {
      expect(data.length).toBe(3);
    });
    test('version number from the model', () => {
      expect(version()).toBe('0.0.1');
    });
  });

  // --1 TEST DE LA FACTORY 
  describe('VehicleFactory', () => {
    test('doit créer la flotte complète à partir du JSON', () => {
      const fleet = VehicleFactory.createFleet(data);
      expect(fleet.length).toBe(3);
      //Vérifie que le premier est bien un Truck (selon ton JSON)
      expect(fleet[0]).toBeInstanceOf(Truck);
    });
  });




});


