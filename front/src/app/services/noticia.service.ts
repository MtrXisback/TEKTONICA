import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia } from '../models/noticia.model';
import { getApiUrl } from '../config/api.config';

/**
 * Servicio Angular encargado de gestionar las novedades y artículos del blog consumiendo la API de TEKTONICA.
 */
@Injectable({
  providedIn: 'root'
})
export class NoticiaService {

  // Endpoint base para la gestión de novedades en la API REST
  private apiUrl = getApiUrl('noticias');

  constructor(private http: HttpClient) {}

  /**
   * Genera las cabeceras de autorización Basic Auth recuperando dinámicamente
   * el token de sesión del administrador autenticado.
   */
  private obtenerCabecerasDeSeguridad(): HttpHeaders {
    const token = sessionStorage.getItem('tektonica_sesion_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Basic ${token}` : ''
    });
  }

  /**
   * Obtiene el listado de todas las noticias publicadas.
   * Consume: GET /api/v1/noticias
   */
  obtenerTodas(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl);
  }

  /**
   * Obtiene una noticia individual por su identificador único.
   * Consume: GET /api/v1/noticias/{id}
   */
  obtenerNoticiaPorId(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra una nueva noticia o artículo técnico.
   * Consume: POST /api/v1/noticias
   */
  crearNoticia(noticia: Noticia): Observable<Noticia> {
    return this.http.post<Noticia>(this.apiUrl, noticia, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }

  /**
   * Actualiza una noticia o artículo técnico existente.
   * Consume: PUT /api/v1/noticias/{id}
   */
  actualizarNoticia(id: number, noticia: Noticia): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.apiUrl}/${id}`, noticia, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }

  /**
   * Elimina de forma física una noticia del sistema.
   * Consume: DELETE /api/v1/noticias/{id}
   */
  eliminarNoticia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }
}
