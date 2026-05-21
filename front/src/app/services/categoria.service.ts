import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { getApiUrl } from '../config/api.config';

/**
 * Servicio Angular para consumir la API REST de Categorías del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  
  // Endpoint base de la API de categorías
  private apiUrl = getApiUrl('categorias');

  constructor(private http: HttpClient) {}

  /**
   * Obtiene únicamente las categorías activas para renderizar en la vista pública
   * Consume: GET /api/v1/categorias/activas
   */
  obtenerCategoriasActivas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/activas`);
  }

  /**
   * Obtiene el listado completo de categorías registradas (activo/inactivo)
   * Consume: GET /api/v1/categorias
   */
  obtenerTodasLasCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }
}
