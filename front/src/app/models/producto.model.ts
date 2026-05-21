import { Categoria } from './categoria.model';

export interface Producto {
  id?: number;
  categoriaId: number;
  categoria?: Categoria;
  nombre: string;
  marca: string;
  modelo: string;
  descripcionTecnica: string;
  urlImagen?: string;
  especificaciones?: string;
  activo?: boolean;
  fechaCreacion?: string;
}
