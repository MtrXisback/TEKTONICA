import { Component, OnInit } from '@angular/core';

/**
 * Componente de Página para la sección institucional "Quiénes Somos" de TEKTONICA.
 * Presenta una estructura editorial con una cuadrícula asimétrica y minimalismo de alta gama.
 */
@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.css',
  standalone: false
})
export class QuienesSomosPage implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Garantiza que al navegar a esta vista se desplace automáticamente hacia la parte superior
    window.scrollTo(0, 0);
  }
}
