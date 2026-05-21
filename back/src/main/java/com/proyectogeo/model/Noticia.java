package com.proyectogeo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidad JPA que mapea la tabla 'noticias'.
 * Representa las novedades, blogs y artículos técnicos publicados por TEKTONICA.
 * Incluye campos editoriales extendidos para subtítulos, video embebido y ficha técnica.
 */
@Entity
@Table(name = "noticias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false, length = 100)
    private String categoria;

    @Column(name = "fecha", insertable = false, updatable = false)
    private LocalDateTime fecha;

    @Column(name = "url_imagen", length = 500)
    private String urlImagen;

    /** Subtítulo editorial secundario para enriquecer la jerarquía del artículo. */
    @Column(name = "subtitulo_secundario", columnDefinition = "TEXT")
    private String subtituloSecundario;

    /** URL de video embebido (YouTube/Vimeo en formato embed). */
    @Column(name = "url_video_embebido", length = 500)
    private String urlVideoEmbebido;

    /** Pares clave-valor de datos técnicos separados por comas (ej. "Precisión:±2mm, Autonomía:45 min"). */
    @Column(name = "datos_clave", length = 1000)
    private String datosClave;
}
