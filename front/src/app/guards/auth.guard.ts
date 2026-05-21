import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guardián de Seguridad Perimetral Blindado para la Ruta Administrativa de TEKTONICA.
 *
 * Intercepta cada intento de navegación hacia la ruta protegida '/admin' y delega
 * al AuthService la validación completa del pseudo-token firmado en Base64.
 *
 * Si el token es inexistente, tiene estructura inválida, fue manipulado desde la
 * consola del navegador (F12), o ha expirado por TTL, el guardián ejecuta:
 * 1. sessionStorage.clear() — destrucción total del almacenamiento.
 * 2. Redirección forzosa a '/login'.
 *
 * Este mecanismo impide que un usuario pueda renderizar el cascarón del Dashboard
 * inyectando manualmente valores en sessionStorage, ya que el AuthService valida
 * la integridad criptográfica del token completo en cada cambio de ruta.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Evalúa si la navegación hacia la ruta protegida debe permitirse.
   *
   * Ejecuta la cadena de validación completa del AuthService:
   * - Existencia del token
   * - Decodificación Base64
   * - Estructura de 4 segmentos (prefijo::email::hash::timestamp)
   * - Prefijo de firma secreto
   * - Email del operador
   * - Hash de credenciales
   * - Vigencia temporal (TTL de 8 horas)
   *
   * @returns `true` si el token es legítimo, íntegro y vigente.
   */
  canActivate(): boolean {
    if (this.authService.estaAutenticado()) {
      return true;
    }

    // El AuthService ya ejecutó sessionStorage.clear() si detectó manipulación.
    // Aquí solo se garantiza la redirección a la pantalla de acceso.
    console.warn('[AuthGuard] Acceso denegado. Token inválido, manipulado o expirado. Redirigiendo a /login...');
    this.router.navigate(['/login']);
    return false;
  }
}
