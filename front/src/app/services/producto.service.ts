import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { getApiUrl } from '../config/api.config';

/**
 * Servicio Angular para consumir la API REST de Productos desde el Backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // Endpoint base de la API de productos
  private apiUrl = getApiUrl('productos');

  constructor(private http: HttpClient) {}

  /**
   * Genera las cabeceras HTTP seguras recuperando el token de autorización Basic Auth
   * almacenado dinámicamente en la sesión del administrador.
   */
  private obtenerCabecerasDeSeguridad(): HttpHeaders {
    const token = sessionStorage.getItem('tektonica_sesion_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Basic ${token}` : ''
    });
  }

  /**
   * Obtiene todos los productos ACTIVOS del catálogo público.
   * Consumido por la vista pública del catálogo técnico.
   * Consume: GET /api/v1/productos
   */
  obtenerTodosLosProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  /**
   * Obtiene el inventario COMPLETO del panel administrativo (activos + inactivos).
   * Requiere autenticación ADMIN — inyecta cabeceras Basic Auth.
   * Consume: GET /api/v1/productos/admin/todos
   */
  obtenerInventarioCompleto(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/admin/todos`, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }

  /**
   * Obtiene los productos activos filtrados por una categoría específica.
   * Consume: GET /api/v1/productos/categoria/{categoriaId}
   */
  obtenerProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  /**
   * Registra un nuevo producto en el catálogo técnico del backend.
   * Consume: POST /api/v1/productos
   */
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }

  /**
   * Actualiza la información técnica de un producto existente.
   * Consume: PUT /api/v1/productos/{id}
   */
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }

  /**
   * Realiza la desactivación o remoción lógica de un producto.
   * Consume: DELETE /api/v1/productos/{id}
   */
  desactivarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }

  /**
   * Alterna el estado activo de un producto del inventario.
   * Consume: PATCH /api/v1/productos/{id}/toggle-status
   */
  toggleStatusProducto(id: number): Observable<Producto> {
    return this.http.patch<Producto>(`${this.apiUrl}/${id}/toggle-status`, {}, {
      headers: this.obtenerCabecerasDeSeguridad()
    });
  }
}
