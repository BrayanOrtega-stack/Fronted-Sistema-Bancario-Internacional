import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Divisa, TasaCambio, CodigoDivisa } from '../models/divisa.model';

@Injectable({ providedIn: 'root' })
export class DivisaService {
  private apiUrl = 'https://stack-backend-banco-git-matias-or-dev.apps.rm2.thpm.p1.openshiftapps.com/api';

  private divisas: Divisa[] = [
    { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: '$' },
    { codigo: 'EUR', nombre: 'Euro', simbolo: '€' },
    { codigo: 'COP', nombre: 'Peso Colombiano', simbolo: '$' },
  ];

  // Tasas respecto a USD como base
  private tasasBaseUsd: Record<CodigoDivisa, number> = {
    USD: 1,
    EUR: 0.92,
    COP: 4050,
  };

  private porcentajeComision = 0.015; // 1.5% comisión internacional

  constructor(private http: HttpClient) {
    this.cargarDivisasDesdeApi();
  }

  cargarDivisasDesdeApi(): void {
    this.http.get<any>(`${this.apiUrl}/catalogos`).subscribe({
      next: (datos) => {
        if (datos && datos.monedas && datos.monedas.length > 0) {
          this.divisas = datos.monedas.map((m: any) => ({
            codigo: m.codigo_iso as CodigoDivisa,
            nombre: m.nombre,
            simbolo: m.codigo_iso === 'EUR' ? '€' : '$',
          }));
        }
      },
      error: (err) => console.error('Error cargando divisas desde OpenShift:', err),
    });
  }

  obtenerDivisas(): Divisa[] {
    return this.divisas;
  }

  obtenerTasaCambio(origen: CodigoDivisa, destino: CodigoDivisa): TasaCambio {
    const tasa = this.tasasBaseUsd[destino] / this.tasasBaseUsd[origen];
    return { origen, destino, tasa };
  }

  simularConversion(monto: number, origen: CodigoDivisa, destino: CodigoDivisa) {
    const { tasa } = this.obtenerTasaCambio(origen, destino);
    const comision = monto * this.porcentajeComision;
    const montoConvertido = (monto - comision) * tasa;
    return {
      tasa,
      comision,
      montoConvertido,
      montoNetoOrigen: monto - comision,
    };
  }
}
