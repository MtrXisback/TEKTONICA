import { Component, OnInit } from '@angular/core';

/**
 * Componente de Página para la sección de "Términos de Servicio" de TEKTONICA.
 * Comparte la misma estructura de rejilla asimétrica editorial de alta gama.
 */
@Component({
  selector: 'app-terminos-servicio',
  templateUrl: './terminos-servicio.html',
  styleUrl: './terminos-servicio.css',
  standalone: false
})
export class TerminosServicioPage implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Garantiza que al navegar a esta vista se desplace automáticamente hacia la parte superior
    window.scrollTo(0, 0);
  }
}
