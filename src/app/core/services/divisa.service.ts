import { Injectable } from '@angular/core';
import { Divisa, TasaCambio, CodigoDivisa } from '../models/divisa.model';

@Injectable({ providedIn: 'root' })
export class DivisaService {
  private divisas: Divisa[] = [
    { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: '$' },
    { codigo: 'EUR', nombre: 'Euro', simbolo: '€' },
    { codigo: 'COP', nombre: 'Peso Colombiano', simbolo: '$' },
  ];

  // Tasas simuladas respecto a USD como base
  private tasasBaseUsd: Record<CodigoDivisa, number> = {
    USD: 1,
    EUR: 0.92,
    COP: 4050,
  };

  private porcentajeComision = 0.015; // 1.5% comisión internacional simulada

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
