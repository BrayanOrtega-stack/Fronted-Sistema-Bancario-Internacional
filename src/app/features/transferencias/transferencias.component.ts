import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DivisaService } from '../../core/services/divisa.service';
import { TransferenciaService } from '../../core/services/transferencia.service';
import { Divisa, CodigoDivisa } from '../../core/models/divisa.model';

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transferencias.component.html',
  styleUrl: './transferencias.component.css',
})
export class TransferenciasComponent {
  divisas: Divisa[];
  formulario: FormGroup;

  simulacion: {
    tasa: number;
    comision: number;
    montoConvertido: number;
    montoNetoOrigen: number;
  } | null = null;

  enviando = false;
  transferenciaExitosa = false;

  constructor(
    private fb: FormBuilder,
    private divisaService: DivisaService,
    private transferenciaService: TransferenciaService
  ) {
    this.divisas = this.divisaService.obtenerDivisas();

    this.formulario = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      numeroCuentaIban: ['', [Validators.required, Validators.minLength(6)]],
      codigoSwiftBic: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{8,11}$/)]],
      bancoDestino: ['', Validators.required],
      pais: ['', Validators.required],
      divisaOrigen: ['USD', Validators.required],
      divisaDestino: ['EUR', Validators.required],
      monto: [null, [Validators.required, Validators.min(1)]],
    });

    this.formulario.valueChanges.subscribe(() => this.actualizarSimulacion());
    this.actualizarSimulacion();
  }

  actualizarSimulacion(): void {
    const { divisaOrigen, divisaDestino, monto } = this.formulario.value;
    if (!divisaOrigen || !divisaDestino || !monto || monto <= 0) {
      this.simulacion = null;
      return;
    }
    this.simulacion = this.divisaService.simularConversion(
      monto,
      divisaOrigen as CodigoDivisa,
      divisaDestino as CodigoDivisa
    );
  }

  enviarFormulario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.value;
    this.enviando = true;
    this.transferenciaExitosa = false;

    this.transferenciaService
      .enviarTransferencia({
        beneficiario: {
          nombreCompleto: valores.nombreCompleto,
          numeroCuentaIban: valores.numeroCuentaIban,
          codigoSwiftBic: valores.codigoSwiftBic,
          bancoDestino: valores.bancoDestino,
          pais: valores.pais,
        },
        divisaOrigen: valores.divisaOrigen,
        divisaDestino: valores.divisaDestino,
        monto: valores.monto,
      })
      .then(() => {
        this.enviando = false;
        this.transferenciaExitosa = true;
        this.formulario.reset({ divisaOrigen: 'USD', divisaDestino: 'EUR' });
      });
  }

  campoInvalido(nombre: string): boolean {
    const control = this.formulario.get(nombre);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
