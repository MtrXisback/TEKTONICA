import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de Pantalla de Acceso del Operador Técnico de TEKTONICA.
 *
 * Presenta un formulario de autenticación minimalista y premium que valida
 * las credenciales del operador a través del AuthService centralizado.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: false
})
export class LoginPage {

  email: string = '';
  contrasena: string = '';
  errorCredenciales: boolean = false;
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Procesa el envío del formulario de autenticación.
   * Valida las credenciales en el servidor y redirige al panel administrativo en caso exitoso.
   */
  onSubmit(): void {
    this.errorCredenciales = false;
    this.cargando = true;

    this.authService.iniciarSesion(this.email, this.contrasena).subscribe({
      next: (autenticado) => {
        if (autenticado) {
          this.router.navigate(['/admin']);
        } else {
          this.errorCredenciales = true;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('[LoginPage] Error en llamada de login:', err);
        this.errorCredenciales = true;
        this.cargando = false;
      }
    });
  }
}
