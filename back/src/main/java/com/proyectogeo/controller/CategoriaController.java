package com.proyectogeo.controller;

import com.proyectogeo.model.Categoria;
import com.proyectogeo.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con las Categorías.
 */
@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*") // Habilitado para facilitar la comunicación inicial con Angular
@Tag(name = "Categorías", description = "Controlador encargado de la gestión y consulta de categorías tecnológicas del catálogo.")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    /**
     * Endpoint para listar todas las categorías registradas.
     * GET /api/v1/categorias
     */
    @GetMapping
    @Operation(summary = "Listar todas las categorías", description = "Devuelve el listado completo de categorías registradas en la base de datos.")
    public ResponseEntity<List<Categoria>> listarTodas() {
        return ResponseEntity.ok(categoriaService.obtenerTodas());
    }

    /**
     * Endpoint para listar únicamente las categorías activas.
     * GET /api/v1/categorias/activas
     */
    @GetMapping("/activas")
    @Operation(summary = "Listar categorías activas", description = "Devuelve únicamente las categorías de productos que se encuentran activas en el sistema.")
    public ResponseEntity<List<Categoria>> listarActivas() {
        return ResponseEntity.ok(categoriaService.obtenerActivas());
    }
}
