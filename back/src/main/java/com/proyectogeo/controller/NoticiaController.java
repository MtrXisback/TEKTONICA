package com.proyectogeo.controller;

import com.proyectogeo.model.Noticia;
import com.proyectogeo.repository.NoticiaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controlador REST encargado de exponer las operaciones CRUD para el módulo de Noticias (Novedades).
 */
@RestController
@RequestMapping("/noticias")
@Tag(name = "Noticias", description = "Controlador administrativo y de lectura para las novedades y artículos del blog.")
public class NoticiaController {

    private final NoticiaRepository noticiaRepository;

    @Autowired
    public NoticiaController(NoticiaRepository noticiaRepository) {
        this.noticiaRepository = noticiaRepository;
    }

    /**
     * Endpoint público para obtener todas las noticias del blog organizadas cronológicamente.
     * GET /api/v1/noticias
     */
    @GetMapping
    @Operation(summary = "Obtener todas las noticias", description = "Devuelve el listado completo de novedades y blogs técnicos de la plataforma de forma pública.")
    public ResponseEntity<List<Noticia>> obtenerTodas() {
        List<Noticia> noticias = noticiaRepository.findAll();
        return ResponseEntity.ok(noticias);
    }

    /**
     * Endpoint público para obtener una noticia individual por su ID.
     * GET /api/v1/noticias/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener noticia por ID", description = "Devuelve el detalle completo de un artículo a partir de su identificador único.")
    public ResponseEntity<Noticia> obtenerPorId(@PathVariable Long id) {
        return noticiaRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint protegido para registrar una nueva noticia o artículo técnico.
     * POST /api/v1/noticias
     */
    @PostMapping
    @Operation(summary = "Registrar nueva noticia", description = "Crea y almacena un nuevo artículo técnico en la base de datos. Requiere rol ADMIN.")
    public ResponseEntity<Noticia> crear(@RequestBody Noticia noticia) {
        // Garantizamos que no se pase ID predefinido para forzar inserción
        noticia.setId(null);
        Noticia guardada = noticiaRepository.save(noticia);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    /**
     * Endpoint protegido para actualizar una noticia o artículo técnico existente.
     * PUT /api/v1/noticias/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar noticia existente", description = "Actualiza el contenido de un artículo a partir de su ID. Requiere rol ADMIN.")
    public ResponseEntity<Noticia> actualizar(@PathVariable Long id, @RequestBody Noticia noticia) {
        if (!noticiaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        noticia.setId(id);
        Noticia actualizada = noticiaRepository.save(noticia);
        return ResponseEntity.ok(actualizada);
    }

    /**
     * Endpoint protegido para eliminar físicamente una noticia a partir de su ID.
     * DELETE /api/v1/noticias/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar noticia físicamente", description = "Remueve permanentemente un artículo de novedad de la base de datos de TEKTONICA. Requiere rol ADMIN.")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!noticiaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        noticiaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
