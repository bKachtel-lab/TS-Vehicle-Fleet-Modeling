import { promises as fs } from 'fs';
import { beforeAll, describe, expect, test } from 'vitest';

import { version } from './index';

import { Truck } from '../src/models/vehicles/truck';
import { ElectricCar } from '../src/models/vehicles/electricCar';
import { SpeedSensor } from '../src/models/sensors/speedSensor';
import { LoadSensor } from '../src/models/sensors/loadSensor';
import { BatterySensor } from '../src/models/sensors/batterySensor';
import { VehicleFactory } from './services/vehicleFactory';
import { Car } from './models/vehicles/car';
import { Bike } from './models/vehicles/bike';
import { FuelLevelSensor } from './models/sensors/fuelLevelSensor';
import { GPSSensor } from './models/sensors/GPSSensor';
import { SensorHistory } from './models/sensors/sensorHistory';

let data: any;

beforeAll(async () => {
  const raw = await fs.readFile('./resources/test_data.json', 'utf8');
  data = JSON.parse(raw);
});

describe('Core Tests', () => {

  test('data and version', () => {
    expect(data.length).toBe(3);
    expect(version()).toBe('0.0.1');
  });

  // ---------------- FACTORY ----------------
  describe('VehicleFactory', () => {

    test('creates fleet from JSON', () => {
      const fleet = VehicleFactory.createFleet(data);
      expect(fleet.length).toBe(3);
      expect(fleet[0]).toBeInstanceOf(Truck);
    });

    test('throws on unknown vehicle type', () => {
      expect(() => {
        VehicleFactory.createFleet([{ id: 1, type: 'UFO', sensors: [] }] as any);
      }).toThrow();
    });

    test('throws on unknown sensor type', () => {
      expect(() => {
        VehicleFactory.createFleet([{
          id: 1,
          type: 'Truck',
          sensors: [{ id: 1, type: 'X', data: [] }]
        }] as any);
      }).toThrow();
    });

    test('handles undefined sensors and multiple types', () => {
      const input = [
        {
          id: 1,
          type: 'Car',
          brand: 'Peugeot',
          model: '208',
          year: 2024,
          fuelType: 'Essence',
          sensors: undefined
        },
        {
          id: 2,
          type: 'ElectricCar',
          brand: 'Tesla',
          model: '3',
          year: 2024,
          batteryCapacity: 75,
          sensors: undefined
        }
      ];

      const fleet = VehicleFactory.createFleet(input as any);
      expect(fleet.length).toBe(2);
    });

  });

  // ---------------- VEHICLES ----------------
  describe('Vehicles', () => {

    test('Truck without sensor', () => {
      const t = new Truck(1, 'Volvo', 'FH', 2024, 1000, []);
      expect(t.getLoadRate()).toBe(0);

      t.setLoad(1500);
      expect(t.isOverLoaded()).toBe(false);
    });

    test('Truck with sensor', () => {
      const s = new LoadSensor(1, 'Load', []);
      const t = new Truck(1, 'Volvo', 'FH', 2024, 1000, [s]);

      t.setLoad(500);
      expect(t.getLoadRate()).toBe(50);
    });

    test('ElectricCar with battery sensor', () => {
      const b = new BatterySensor(1, 'Battery', [{ timestamp: 't', value: 50 }]);
      const e = new ElectricCar(1, 'Tesla', '3', 2024, 100, [b]);

      expect(e.getBatteryStatus()).toBe(50);

      e.chargeBattery(100);
      expect(e.getBatteryStatus()).toBe(100);
    });

    test('ElectricCar fallback without sensor', () => {
      const e = new ElectricCar(1, 'Tesla', 'Model S', 2024, 100, []);
      expect(e.getBatteryStatus()).toBe(0);
      expect(e.getEstimatedRange()).toBe(0);
    });

    test('Car fuel logic', () => {
      const f = new FuelLevelSensor(1, 'Fuel', []);
      const c = new Car(1, 'Peugeot', '208', 2024, 'Essence', [f]);

      c.refillFuel(80);
      expect(c.getFuelLevel()).toBe(80);
    });

    test('Car fallback without sensor', () => {
      const c = new Car(1, 'Peugeot', '208', 2024, 'Essence', []);
      c.refillFuel(50);
      expect(c.getFuelLevel()).toBe(0);
    });

    test('Bike default behavior', () => {
      const b = new Bike(1, 'Giant', 'Escape', 2024, 'VTC', []);
      expect(b.getAverageSpeed()).toBe(0);
    });

    test('Vehicle sensor management', () => {
      const s = new SpeedSensor(1, 'Speed', []);
      const v = new Bike(1, 'B', 'M', 2024, 'VTT', [s]);

      expect(v.getSensor('Speed')).toBeDefined();

      v.removeSensor(1);
      expect(v.getSensor('Speed')).toBeUndefined();
    });

  });

  // ---------------- SENSORS ----------------
  describe('Sensors', () => {

    test('SpeedSensor with data', () => {
      const s = new SpeedSensor(1, 'Speed', [
        { timestamp: 't1', value: 20 },
        { timestamp: 't2', value: 40 }
      ]);

      expect(s.getSpeed()).toBe(40);
      expect(s.getAverageSpeed()).toBe(30);
    });

    test('SpeedSensor empty', () => {
      const s = new SpeedSensor(1, 'Speed', []);
      expect(s.getSpeed()).toBe(0);
      expect(s.getAverageSpeed()).toBe(0);
    });

    test('BatterySensor with discharge', () => {
      const b = new BatterySensor(1, 'Battery', [
        { timestamp: 't1', value: 100 },
        { timestamp: 't2', value: 60 }
      ]);

      expect(b.getBatteryLevel()).toBe(60);
      expect(b.gitDischargeRate()).toBe(40);
    });

    test('BatterySensor stable', () => {
      const b = new BatterySensor(1, 'Battery', [
        { timestamp: 't1', value: 50 },
        { timestamp: 't2', value: 50 }
      ]);

      expect(b.gitDischargeRate()).toBe(0);
    });

    test('BatterySensor empty', () => {
      const b = new BatterySensor(1, 'Battery', []);
      expect(b.getBatteryLevel()).toBe(0);
    });

    test('Generic sensor statistics', () => {
      const s = new SpeedSensor(1, 'Speed', [
        { timestamp: 't1', value: 10 },
        { timestamp: 't2', value: 50 }
      ]);

      expect(s.getAverage()).toBe(30);
      expect(s.getMaxValue()).toBe(50);
      expect(s.getEvolution()).toBe(40);
    });

    test('Sensor fallback behavior', () => {
      const s = new SpeedSensor(1, 'Speed', []);

      expect(s.getAverage()).toBe(0);
      expect(s.getMaxValue()).toBe(0);
      expect(s.getEvolution()).toBe(0);
    });

    test('Fuel and Load sensor fallback', () => {
      const f = new FuelLevelSensor(1, 'Fuel', []);
      const l = new LoadSensor(1, 'Load', []);

      expect(f.getAverage()).toBe(0);
      expect(l.getAverage()).toBe(0);
    });

  });

  // ---------------- VEHICLE CORE ----------------
  describe('Vehicle core', () => {

    test('average speed with sensor', () => {
      const s = new SpeedSensor(1, 'Speed', [
        { timestamp: 't1', value: 20 },
        { timestamp: 't2', value: 40 }
      ]);

      const v = new Bike(1, 'B', 'M', 2024, 'VTT', [s]);
      expect(v.getAverageSpeed()).toBe(30);
    });

    test('average speed without sensor', () => {
      const v = new Bike(1, 'B', 'M', 2024, 'VTT', []);
      expect(v.getAverageSpeed()).toBe(0);
    });

  });

  // ---------------- GPS & HISTORY ----------------
  describe('GPS & History', () => {

    test('GPS empty', () => {
      const gps = new GPSSensor(1, 'GPS', []);
      expect(gps.getLocation()).toBeNull();
    });

    test('GPS last value', () => {
      const gps = new GPSSensor(1, 'GPS', [
        { timestamp: 't1', value: { lat: 1, lon: 1 } },
        { timestamp: 't2', value: { lat: 2, lon: 2 } }
      ]);

      expect(gps.getLocation()?.lat).toBe(2);
    });

    test('SensorHistory basic behavior', () => {
      const h = new SensorHistory('2026-01-01T00:00:00Z', 10);

      expect(h.timestamp).toBeInstanceOf(Date);
      expect(h.isNumeric()).toBe(true);
      expect(h.timestamp.getUTCFullYear()).toBe(2026);
    });

    test('SensorHistory formatted date', () => {
      const h = new SensorHistory('2026-01-01T00:00:00Z', 10);
      const formatted = h.getFormattedDate();

      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

  });

});