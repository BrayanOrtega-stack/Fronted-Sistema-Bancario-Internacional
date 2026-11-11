import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  enlaces = [
    { ruta: '/dashboard', etiqueta: 'Dashboard', icono: '◆' },
    { ruta: '/transferencias', etiqueta: 'Transferencias', icono: '⇄' },
    { ruta: '/historial', etiqueta: 'Historial Global', icono: '≡' },
  ];
}
