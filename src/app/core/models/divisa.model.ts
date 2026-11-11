export type CodigoDivisa = 'USD' | 'EUR' | 'COP';

export interface Divisa {
  codigo: CodigoDivisa;
  nombre: string;
  simbolo: string;
}

export interface TasaCambio {
  origen: CodigoDivisa;
  destino: CodigoDivisa;
  tasa: number;
}
