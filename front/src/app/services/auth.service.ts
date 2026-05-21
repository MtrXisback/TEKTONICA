import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { getApiUrl } from '../config/api.config';

/**
 * Servicio centralizado de autenticación blindado para el Panel Administrativo de TEKTONICA.
 *
 * Realiza autenticación dinámica contra el backend usando Spring Security Basic Auth,
 * evitando el almacenamiento de credenciales hardcodeadas en el código cliente.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Clave de almacenamiento en sessionStorage para el token de sesión Basic Auth
  private readonly CLAVE_TOKEN = 'tektonica_sesion_token';

  // Endpoint protegido para verificar credenciales (usa el inventario de admin)
  private readonly AUTH_URL = getApiUrl('productos/admin/todos');

  constructor(private http: HttpClient) {}

  /**
   * Valida las credenciales del operador contra el backend y genera una sesión.
   *
   * @param email       Correo electrónico o usuario del operador.
   * @param contrasena  Contraseña de acceso al panel.
   * @returns Observable<boolean> que emite true si las credenciales son válidas.
   */
  iniciarSesion(email: string, contrasena: string): Observable<boolean> {
    // Generar el token Basic Auth (Base64 de email:contrasena)
    const tokenCodificado = btoa(`${email}:${contrasena}`);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${tokenCodificado}`
    });

    // Validamos llamando a un endpoint administrativo protegido
    return this.http.get<any>(this.AUTH_URL, { headers, observe: 'response' }).pipe(
      map(response => {
        if (response.status === 200) {
          sessionStorage.setItem(this.CLAVE_TOKEN, tokenCodificado);
          console.log('[AuthService] Autenticación exitosa en servidor para:', email);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('[AuthService] Error de autenticación o credenciales inválidas en servidor:', error);
        this.cerrarSesion();
        return of(false);
      })
    );
  }

  /**
   * Cierra la sesión activa del operador, destruye el token y limpia todo el almacenamiento.
   */
  cerrarSesion(): void {
    sessionStorage.removeItem(this.CLAVE_TOKEN);
    sessionStorage.clear();
    console.log('[AuthService] Sesión destruida. Token y almacenamiento limpiados.');
  }

  /**
   * Evalúa la autenticidad e integridad del token de sesión almacenado.
   *
   * @returns `true` si el token existe en el almacenamiento local de sesión.
   */
  estaAutenticado(): boolean {
    const token = sessionStorage.getItem(this.CLAVE_TOKEN);
    return token !== null && token.length > 0;
  }
}
