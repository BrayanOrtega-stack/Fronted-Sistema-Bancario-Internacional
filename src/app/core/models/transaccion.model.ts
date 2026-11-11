import { CodigoDivisa } from './divisa.model';

export type EstadoTransaccion = 'Completada' | 'Pendiente' | 'Rechazada';
export type TipoTransaccion = 'Transferencia Internacional' | 'Depósito' | 'Retiro' | 'Pago de Préstamo';

export interface Transaccion {
  id: string;
  fecha: string; // ISO date string
  descripcion: string;
  beneficiario?: string;
  pais?: string;
  divisa: CodigoDivisa;
  monto: number;
  tipo: TipoTransaccion;
  estado: EstadoTransaccion;
}

export interface FiltroTransacciones {
  fechaDesde?: string;
  fechaHasta?: string;
  divisa?: CodigoDivisa | 'TODAS';
  estado?: EstadoTransaccion | 'TODAS';
}
