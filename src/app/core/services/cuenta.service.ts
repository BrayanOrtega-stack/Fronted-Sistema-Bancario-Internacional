import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cuenta, MovimientoResumen } from '../models/cuenta.model';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private apiUrl = 'https://stack-backend-banco-git-matias-or-dev.apps.rm2.thpm.p1.openshiftapps.com/api';

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

  constructor(private http: HttpClient) {
    this.cargarCuentasDesdeApi();
  }

  cargarCuentasDesdeApi(): void {
    this.http.get<any[]>(`${this.apiUrl}/cuentas`).subscribe({
      next: (datos) => {
        if (datos && datos.length > 0) {
          this.cuentas = datos.map((c) => ({
            id: String(c.num_cuenta),
            alias: `Cuenta ${c.codigo_moneda} (${c.num_cuenta})`,
            numeroCuenta: String(c.num_cuenta),
            divisa: c.codigo_moneda,
            saldo: Number(c.saldo),
            tipo: c.id_tipo_cuenta === 1 ? 'Ahorros' : 'Corriente',
          }));
        }
      },
      error: (err) => console.error('Error cargando cuentas desde OpenShift:', err),
    });
  }

  obtenerCuentas(): Cuenta[] {
    return this.cuentas;
  }

  obtenerMovimientosRecientes(): MovimientoResumen[] {
    return this.movimientos;
  }
}
