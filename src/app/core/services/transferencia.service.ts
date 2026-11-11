import { Injectable } from '@angular/core';
import { Beneficiario } from '../models/beneficiario.model';
import { CodigoDivisa } from '../models/divisa.model';
import { Transaccion } from '../models/transaccion.model';
import { TransaccionService } from './transaccion.service';

export interface SolicitudTransferencia {
  beneficiario: Beneficiario;
  divisaOrigen: CodigoDivisa;
  divisaDestino: CodigoDivisa;
  monto: number;
}

@Injectable({ providedIn: 'root' })
export class TransferenciaService {
  constructor(private transaccionService: TransaccionService) {}

  /**
   * Simula el envío de una transferencia internacional.
   * En un entorno real esto sería una llamada HTTP a la API del banco.
   */
  enviarTransferencia(solicitud: SolicitudTransferencia): Promise<Transaccion> {
    const nuevaTransaccion: Transaccion = {
      id: 't' + Date.now(),
      fecha: new Date().toISOString().slice(0, 10),
      descripcion: `Transferencia a ${solicitud.beneficiario.nombreCompleto}`,
      beneficiario: solicitud.beneficiario.nombreCompleto,
      pais: solicitud.beneficiario.pais,
      divisa: solicitud.divisaOrigen,
      monto: solicitud.monto,
      tipo: 'Transferencia Internacional',
      estado: 'Pendiente',
    };

    this.transaccionService.registrarTransferencia(nuevaTransaccion);

    // Simula latencia de red
    return new Promise((resolve) => {
      setTimeout(() => resolve(nuevaTransaccion), 600);
    });
  }
}
