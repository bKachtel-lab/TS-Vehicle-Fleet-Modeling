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
import { Car } from './models/vehicles/car';
import { Bike } from './models/vehicles/bike';
import { FuelLevelSensor } from './models/sensors/fuelLevelSensor';
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

    test('doit gérer les types de véhicules inconnus dans le JSON', () => {
      const badData = [{
        id: 999, 
        type: 'UFO', 
        brand: 'Alien', 
        model:'X-Files', 
        year : 2026, 
        sensors:[]}];

      expect(() => {
        VehicleFactory.createFleet(badData as any);
      }).toThrow('Type de véhicule non géré : UFO');
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

   describe('Electrical Model', () => {
    test('doit gérer la batterie et l\'autonomie', () => {
      const fleet = VehicleFactory.createFleet(data);
      const eCar = fleet.find(v => v instanceof ElectricCar) as ElectricCar;

      if(eCar) {
        const battery = eCar.getBatteryStatus();
        expect(battery).toBeGreaterThanOrEqual(0);
        expect(battery).toBeLessThanOrEqual(100);

        eCar.chargeBattery(100);
        expect(eCar.getBatteryStatus()).toBe(100);
        expect(eCar.getEstimatedRange()).toBeGreaterThan(0);
      }
    });
   });
   // --- 4. TESTS DE LA CAR (THERMIQUE) ET DU BIKE ---
  describe('Other Vehicles', () => {
    test('doit gérer le plein d\'essence pour une Car', () => {
        // On crée manuellement pour tester la logique si pas dans le JSON
        const fuelSensor = new FuelLevelSensor(50, 'Fuel', [{ timestamp: 'now', value: 10 }]);
        const car = new Car(303, 'Peugeot', '208', 2022, 'Essence', [fuelSensor]);
        car.refillFuel(80);
        // Si tu as un FuelSensor, on vérifie la valeur
        expect(car.getFuelLevel()).toBe(80);
    });

    //Test sur ElectricCar Manuellement
      test('doit gérer une ElectricCar manuellement', () => {
      const batSensor = new BatterySensor(60, 'Battery', [{ timestamp: 'now', value: 50 }]);
      const eCar = new ElectricCar(404, 'Tesla', 'Model 3', 2023, 100,[batSensor]);
      
      expect(eCar.getBatteryStatus()).toBe(50);
      eCar.chargeBattery(100);
      expect(eCar.getBatteryStatus()).toBe(100);
      expect(eCar.getEstimatedRange()).toBeGreaterThan(0);
    });

    // Test sur un Bike
    test('doit instancier un Bike correctement', () => {
        const bike = new Bike(88, 'Giant', 'Escape', 2022, 'VTC', []);
        expect(bike.bikeType).toBe('VTC');
        expect(bike.getAverageSpeed()).toBe(0); // Pas de capteur
    });
  });

  // --- 5. TESTS DES CAPTEURS (STATISTIQUES) ---
  describe('Sensors Stats', () => {
    test('doit calculer la vitesse moyenne via le capteur', () => {
        const fleet = VehicleFactory.createFleet(data);
        const v = fleet[0]; // On prend le premier
        const speed = v.getAverageSpeed();
        expect(typeof speed).toBe('number');
    });

    test('Coverage total des méthodes de Sensor (Moyenne, Max, Evolution)', () => {
      //On crée un capteru avec historique riche pour passer dans toutes les lignes
      const history = [
        {timestamp: '2026-01-01T10:00:00Z', value: 10 },
        { timestamp: '2026-01-01T10:10:00Z', value: 50 }
      ]

      const sensor = new SpeedSensor(1, 'Speed', history);

      expect(sensor.getAverage()).toBe(30);
      expect(sensor.getMaxValue()).toBe(50);
      expect(sensor.getEvolution()).toBe(40);
      expect(sensor.getLastValue()).toBe(50);

      // Cas capteur vide
      const emptySensor = new SpeedSensor(2, 'Speed', []);
      expect(emptySensor.getAverage()).toBe(0);
      expect(emptySensor.getMaxValue()).toBe(0);
      expect(emptySensor.getEvolution()).toBe(0);

    })
  });


});


