export interface Cotizacion {
  id?: number;
  nombreCompleto: string;
  empresa?: string;
  correo: string;
  telefono: string;
  productoId?: number;
  mensaje: string;
  atendido?: boolean;
  fechaCreacion?: string;
}
