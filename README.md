# Sistema Bancario Internacional - Frontend

Frontend en Angular (standalone components) para el Sistema Bancario Internacional.

## Módulos incluidos
- **Dashboard**: saldos consolidados en USD, EUR y COP, indicador de ingresos/egresos, accesos rápidos.
- **Transferencias Internacionales**: formulario completo (beneficiario, IBAN/cuenta, SWIFT/BIC, banco destino, país) con simulador de tasa de cambio y comisión.
- **Historial de Transacciones Globales**: tabla responsiva con filtros por fecha, divisa y estado.

## Cómo ejecutar
```bash
npm install
ng serve
```
Luego abre http://localhost:4200

## Estructura
```
src/app/
  core/models/       -> interfaces de datos (cuentas, transacciones, beneficiarios, divisas)
  core/services/      -> servicios que simulan datos (sin backend real)
  features/dashboard/
  features/transferencias/
  features/historial/
  shared/components/  -> navbar y sidebar
```

Los datos son simulados en memoria mediante los servicios en `core/services`, listos para ser reemplazados por llamadas HTTP reales a una API.
