import { Injectable } from '@angular/core';
import { Cuenta, MovimientoResumen } from '../models/cuenta.model';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private cuentas: Cuenta[] = [
    { id: 'c1', alias: 'Cuenta Principal USD', numeroCuenta: '****4821', divisa: 'USD', saldo: 18540.32, tipo: 'Corriente' },
    { id: 'c2', alias: 'Cuenta Ahorros EUR', numeroCuenta: '****7733', divisa: 'EUR', saldo: 9210.50, tipo: 'Ahorros' },
    { id: 'c3', alias: 'Cuenta Local COP', numeroCuenta: '****1190', divisa: 'COP', saldo: 42350000, tipo: 'Corriente' },
  ];

  private movimientos: MovimientoResumen[] = [
    { mes: 'Jun', ingresos: 5200, egresos: 3100 },
    { mes: 'Jul', ingresos: 6100, egresos: 4200 },
    { mes: 'Ago', ingresos: 4800, egresos: 3900 },
    { mes: 'Sep', ingresos: 7200, egresos: 5100 },
    { mes: 'Oct', ingresos: 6600, egresos: 4700 },
    { mes: 'Nov', ingresos: 7800, egresos: 4100 },
  ];

  obtenerCuentas(): Cuenta[] {
    return this.cuentas;
  }

  obtenerMovimientosRecientes(): MovimientoResumen[] {
    return this.movimientos;
  }
}
