import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransaccionService } from '../../core/services/transaccion.service';
import { Transaccion, EstadoTransaccion } from '../../core/models/transaccion.model';
import { CodigoDivisa } from '../../core/models/divisa.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent {
  todasLasTransacciones: Transaccion[];
  transaccionesFiltradas: Transaccion[];
  filtroForm: FormGroup;

  divisasDisponibles: (CodigoDivisa | 'TODAS')[] = ['TODAS', 'USD', 'EUR', 'COP'];
  estadosDisponibles: (EstadoTransaccion | 'TODAS')[] = ['TODAS', 'Completada', 'Pendiente', 'Rechazada'];

  constructor(
    private transaccionService: TransaccionService,
    private fb: FormBuilder
  ) {
    this.todasLasTransacciones = this.transaccionService.obtenerTransacciones();
    this.transaccionesFiltradas = this.todasLasTransacciones;

    this.filtroForm = this.fb.group({
      fechaDesde: [''],
      fechaHasta: [''],
      divisa: ['TODAS'],
      estado: ['TODAS'],
    });

    this.filtroForm.valueChanges.subscribe(() => this.aplicarFiltros());
  }

  aplicarFiltros(): void {
    const valores = this.filtroForm.value;
    this.transaccionesFiltradas = this.transaccionService.filtrarTransacciones({
      fechaDesde: valores.fechaDesde || undefined,
      fechaHasta: valores.fechaHasta || undefined,
      divisa: valores.divisa,
      estado: valores.estado,
    });
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({ fechaDesde: '', fechaHasta: '', divisa: 'TODAS', estado: 'TODAS' });
  }

  claseEstado(estado: string): string {
    return 'badge badge-' + estado.toLowerCase();
  }
}
