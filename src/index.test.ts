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

  // --2 TEST DU MODÈLE TRUCK --
 
   describe('Truck Model', () => {
    test('Cas sans capteur de type Load: doit calculer correctement la charge et détecter la surcharge', () => {
      
       const fleet = VehicleFactory.createFleet(data);
       const truck = fleet.find(v => v instanceof Truck) as Truck;

       //Il doit trouver le truck present dans le JSON
       expect(truck);

       if(truck) {
          const initialRate = truck.getLoadRate();
          expect(!initialRate);

          //TEST DE setLoad
          truck.setLoad(truck.maxLoad + 100); // On force la surharge
          expect(truck.isOverLoaded()).toBe(false);
       }
    });
    test ('Cas avec capteur de type Load', () => {
      // On crée un capteur de charge manuellement pour isoler le test
      const loadSensor = new LoadSensor(99, 'Load', []);
      const truck = new Truck(101, 'Volvo', 'FH16', 2024, 40000, [loadSensor]);

      // 1. Test de la charge initiale (0)
      expect(truck.getLoadRate()).toBe(0);

      // 2. Test de mise à jour de la charge
      truck.setLoad(20000); // 50%
      expect(truck.getLoadRate()).toBe(50);
      expect(truck.isOverLoaded()).toBe(false);

      // 3. Test de la surcharge
      truck.setLoad(45000); 
      expect(truck.isOverLoaded()).toBe(true);
    })
   });



});


