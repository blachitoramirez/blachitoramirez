
export enum AppMode {
  CONDUCTOR = 'CONDUCTOR',
  ADMIN = 'ADMIN'
}

export interface Route {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
}

export interface PassengerLog {
  timestamp: number;
  type: 'SUBE' | 'BAJA';
  location: {
    lat: number;
    lng: number;
  };
  passengersCount: number;
}

export interface Session {
  id: string;
  vehicleId: string;
  routeId: string;
  turn: string;
  startTime: number;
  endTime?: number;
  logs: PassengerLog[];
  totalCollected: number;
  isClosed: boolean;
}

export interface GeoFenceAlert {
  id: string;
  vehiclePlate: string;
  type: 'DESVIO' | 'PARADA_NO_AUTORIZADA' | 'SOBRECUPO';
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  location: string;
}
