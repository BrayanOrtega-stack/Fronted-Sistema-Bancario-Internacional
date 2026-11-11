import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CuentaService } from '../../core/services/cuenta.service';
import { TransaccionService } from '../../core/services/transaccion.service';
import { Cuenta, MovimientoResumen } from '../../core/models/cuenta.model';
import { Transaccion } from '../../core/models/transaccion.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  cuentas: Cuenta[];
  movimientos: MovimientoResumen[];
  ultimasTransacciones: Transaccion[];
  alturaMaxGrafico = 0;

  accesosRapidos = [
    { etiqueta: 'Nueva Transferencia', ruta: '/transferencias', icono: '⇄' },
    { etiqueta: 'Ver Historial', ruta: '/historial', icono: '≡' },
    { etiqueta: 'Descargar Estado de Cuenta', ruta: '/historial', icono: '⬇' },
  ];

  constructor(
    private cuentaService: CuentaService,
    private transaccionService: TransaccionService
  ) {
    this.cuentas = this.cuentaService.obtenerCuentas();
    this.movimientos = this.cuentaService.obtenerMovimientosRecientes();
    this.ultimasTransacciones = this.transaccionService.obtenerTransacciones().slice(0, 5);
    this.alturaMaxGrafico = Math.max(
      ...this.movimientos.map((m) => Math.max(m.ingresos, m.egresos))
    );
  }

  alturaBarra(valor: number): string {
    const porcentaje = (valor / this.alturaMaxGrafico) * 100;
    return `${porcentaje}%`;
  }

  formatearSaldo(cuenta: Cuenta): string {
    const simbolo = cuenta.divisa === 'EUR' ? '€' : '$';
    return `${simbolo} ${cuenta.saldo.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  claseEstado(estado: string): string {
    return 'badge badge-' + estado.toLowerCase();
  }
}
