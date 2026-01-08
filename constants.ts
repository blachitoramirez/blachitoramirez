
import { Route, Vehicle } from './types';

export const ROUTES: Route[] = [
  { id: '1', name: 'Armenia ↔ Génova', description: 'Ruta larga / Montaña', basePrice: 12000 },
  { id: '2', name: 'Armenia ↔ Pijao', description: 'Ruta Montaña', basePrice: 10000 },
  { id: '3', name: 'Armenia ↔ Córdoba', description: 'Ruta Montaña', basePrice: 8500 },
  { id: '4', name: 'Armenia ↔ Caicedonia', description: 'Valle del Cauca', basePrice: 11000 },
  { id: '5', name: 'Armenia ↔ Buenavista', description: 'Ruta Corta / Paisajística', basePrice: 7000 },
];

export const VEHICLES: Vehicle[] = [
  { id: 'v1', plate: 'SQK-456', model: 'NKR Turbo' },
  { id: 'v2', plate: 'UVM-123', model: 'Buseta Urbana' },
  { id: 'v3', plate: 'TTR-908', model: 'Colectivo' },
];

export const TURNS = ['Mañana (5:00 - 13:00)', 'Tarde (13:00 - 21:00)', 'Noche (21:00 - 5:00)'];

export const QUINDIO_COORDS = {
  lat: 4.5339,
  lng: -75.6811
};
