import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cotizacion } from '../models/cotizacion.model';
import { getApiUrl } from '../config/api.config';

/**
 * Servicio Angular para gestionar las solicitudes de Cotización (Leads) con el Backend.
 */
@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  // Endpoint base de la API de cotizaciones
  private apiUrl = getApiUrl('cotizaciones');

  constructor(private http: HttpClient) {}

  /**
   * Envía los datos del formulario de contacto para persistirlos en la base de datos de manera pública.
   * Consume: POST /api/v1/cotizaciones
   */
  enviarCotizacion(cotizacion: Cotizacion): Observable<Cotizacion> {
    return this.http.post<Cotizacion>(this.apiUrl, cotizacion);
  }
}
