import { promises as fs } from 'fs';
import { beforeAll, describe, expect, test } from 'vitest';

import { version } from './index';

let data;
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
  /* TODO: Écrire ici la suite de tests pour le modèle objet.*/
  //
});
