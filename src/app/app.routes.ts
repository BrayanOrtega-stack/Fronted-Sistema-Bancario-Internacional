import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'transferencias',
    loadComponent: () =>
      import('./features/transferencias/transferencias.component').then(
        (m) => m.TransferenciasComponent
      ),
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./features/historial/historial.component').then((m) => m.HistorialComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
