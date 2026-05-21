/**
 * Interfaz del modelo de Noticia / Artículo Técnico de TEKTONICA.
 * Mapea la respuesta JSON del endpoint GET /api/v1/noticias/{id}.
 */
export interface Noticia {
  id?: number;
  titulo: string;
  contenido: string;
  categoria: string;
  fecha?: string;
  urlImagen?: string;

  /** Subtítulo editorial secundario. */
  subtituloSecundario?: string;

  /** URL de video embebido (YouTube/Vimeo formato embed). */
  urlVideoEmbebido?: string;

  /** Pares clave-valor de datos técnicos separados por comas. */
  datosClave?: string;
}
