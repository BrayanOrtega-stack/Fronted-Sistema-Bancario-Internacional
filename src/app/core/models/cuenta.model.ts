import { CodigoDivisa } from './divisa.model';

export interface Cuenta {
  id: string;
  alias: string;
  numeroCuenta: string;
  divisa: CodigoDivisa;
  saldo: number;
  tipo: 'Ahorros' | 'Corriente';
}

export interface MovimientoResumen {
  mes: string;
  ingresos: number;
  egresos: number;
}
