import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaccion, FiltroTransacciones } from '../models/transaccion.model';

@Injectable({ providedIn: 'root' })
export class TransaccionService {
  private apiUrl = 'https://stack-backend-banco-git-matias-or-dev.apps.rm2.thpm.p1.openshiftapps.com/api';
  private cuentaActiva: string | null = null;

  private transaccionesDemo: Transaccion[] = [
    { id: 't1', fecha: '2026-11-01', descripcion: 'Transferencia a proveedor', beneficiario: 'Global Tech Supplies', pais: 'Alemania', divisa: 'EUR', monto: 3200, tipo: 'Transferencia Internacional', estado: 'Completada' },
    { id: 't2', fecha: '2026-10-29', descripcion: 'Pago de nómina remota', beneficiario: 'Laura Fernández', pais: 'España', divisa: 'EUR', monto: 1850, tipo: 'Transferencia Internacional', estado: 'Completada' },
    { id: 't3', fecha: '2026-10-25', descripcion: 'Transferencia pendiente de validación', beneficiario: 'Andes Import SAS', pais: 'Colombia', divisa: 'COP', monto: 5200000, tipo: 'Transferencia Internacional', estado: 'Pendiente' },
    { id: 't4', fecha: '2026-10-20', descripcion: 'Pago de préstamo hipotecario', divisa: 'USD', monto: 1200, tipo: 'Pago de Préstamo', estado: 'Completada' },
    { id: 't5', fecha: '2026-10-18', descripcion: 'Transferencia rechazada por datos de IBAN', beneficiario: 'North Trading Ltd', pais: 'Reino Unido', divisa: 'USD', monto: 2400, tipo: 'Transferencia Internacional', estado: 'Rechazada' },
    { id: 't6', fecha: '2026-10-12', descripcion: 'Depósito de cliente', divisa: 'USD', monto: 4500, tipo: 'Depósito', estado: 'Completada' },
    { id: 't7', fecha: '2026-10-05', descripcion: 'Retiro cajero internacional', divisa: 'EUR', monto: 300, tipo: 'Retiro', estado: 'Completada' },
    { id: 't8', fecha: '2026-09-28', descripcion: 'Transferencia a socio comercial', beneficiario: 'Pacific Imports Co.', pais: 'México', divisa: 'USD', monto: 980, tipo: 'Transferencia Internacional', estado: 'Pendiente' },
  ];

  private transacciones: Transaccion[] = [...this.transaccionesDemo];

  constructor(private http: HttpClient) {
    this.cargarMovimientosDesdeApi();
  }

  cargarMovimientosDesdeApi(): void {
    this.http.get<any[]>(`${this.apiUrl}/cuentas`).subscribe({
      next: (cuentas) => {
        if (cuentas && cuentas.length > 0) {
          this.cuentaActiva = String(cuentas[0].num_cuenta);
          this.http.get<any[]>(`${this.apiUrl}/movimientos/${this.cuentaActiva}`).subscribe({
            next: (movs) => {
              const desdeDb: Transaccion[] = (movs || []).map((m, idx) => ({
                id: String(m.id_transaccion || `db-${idx}`),
                fecha: m.fecha_hora ? String(m.fecha_hora).slice(0, 10) : new Date().toISOString().slice(0, 10),
                descripcion: m.descripcion || 'Movimiento bancario',
                beneficiario: m.num_cuenta_destino || undefined,
                divisa: (m.codigo_moneda || m.codigo_iso || 'USD') as any,
                monto: Number(m.monto),
                tipo: (m.tipo === 'transf_intl' ? 'Transferencia Internacional' : m.tipo || 'Transferencia Internacional') as any,
                estado: 'Completada',
              }));
              this.transacciones.splice(0, this.transacciones.length, ...desdeDb, ...this.transaccionesDemo);
            },
            error: (err) => console.error('Error cargando movimientos:', err),
          });
        }
      },
      error: (err) => console.error('Error consultando cuentas para movimientos:', err),
    });
  }

  obtenerTransacciones(): Transaccion[] {
    return this.transacciones;
  }

  filtrarTransacciones(filtro: FiltroTransacciones): Transaccion[] {
    return this.transacciones.filter((t) => {
      if (filtro.fechaDesde && t.fecha < filtro.fechaDesde) return false;
      if (filtro.fechaHasta && t.fecha > filtro.fechaHasta) return false;
      if (filtro.divisa && filtro.divisa !== 'TODAS' && t.divisa !== filtro.divisa) return false;
      if (filtro.estado && filtro.estado !== 'TODAS' && t.estado !== filtro.estado) return false;
      return true;
    });
  }

  registrarTransferencia(transaccion: Transaccion): void {
    if (this.cuentaActiva) {
      const payload = {
        tipo: 'transf_intl',
        num_cuenta: this.cuentaActiva,
        num_cuenta_destino: null,
        monto: transaccion.monto,
        descripcion: `${transaccion.descripcion}${transaccion.pais ? ' - ' + transaccion.pais : ''}`,
      };

      this.http.post(`${this.apiUrl}/transacciones`, payload).subscribe({
        next: () => this.cargarMovimientosDesdeApi(),
        error: (err) => console.error('Error guardando transacción en PostgreSQL:', err),
      });
    } else {
      this.transacciones.unshift(transaccion);
    }
  }
}
