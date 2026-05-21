import { Component, OnInit } from '@angular/core';

/**
 * Componente de Página para la Política de Privacidad de TEKTONICA.
 * Presenta un diseño asimétrico minimalista editorial de alta gama.
 */
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
  standalone: false
})
export class PrivacyPolicyPage implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Asegurar que al navegar a esta vista se desplace automáticamente hacia el inicio
    window.scrollTo(0, 0);
  }
}
