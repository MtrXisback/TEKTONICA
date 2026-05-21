package com.proyectogeo.controller;

import com.proyectogeo.dto.ProductoDTO;
import com.proyectogeo.model.Producto;
import com.proyectogeo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con los Productos.
 */
@RestController
@RequestMapping("/productos")
@Tag(name = "Productos", description = "Controlador encargado del catálogo de productos y el filtrado por categorías.")
public class ProductoController {

    private final ProductoService productoService;

    @Autowired
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    /**
     * Endpoint público para listar todos los productos ACTIVOS del catálogo.
     * Consumido por la vista pública del catálogo técnico de TEKTONICA.
     * GET /api/v1/productos
     */
    @GetMapping
    @Operation(summary = "Listar productos activos (público)", description = "Devuelve exclusivamente los equipos activos visibles en el catálogo público. Los equipos desactivados lógicamente no se incluyen.")
    public ResponseEntity<List<Producto>> listarActivos() {
        return ResponseEntity.ok(productoService.obtenerTodosActivos());
    }

    /**
     * Endpoint protegido para listar el inventario COMPLETO del panel administrativo.
     * Incluye equipos activos e inactivos con sus respectivos badges de estado.
     * GET /api/v1/productos/admin/todos
     */
    @GetMapping("/admin/todos")
    @Operation(summary = "Listar inventario completo (admin)", description = "Devuelve todos los equipos del inventario incluyendo los desactivados lógicamente. Requiere rol ADMIN.")
    public ResponseEntity<List<Producto>> listarTodosParaAdmin() {
        return ResponseEntity.ok(productoService.obtenerTodosParaAdmin());
    }

    /**
     * Endpoint para listar productos filtrados por su categoría.
     * GET /api/v1/productos/categoria/{categoriaId}
     */
    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Listar productos por categoría", description = "Devuelve una lista de productos que pertenecen a la categoría especificada por ID.")
    public ResponseEntity<List<Producto>> listarPorCategoria(@PathVariable Integer categoriaId) {
        return ResponseEntity.ok(productoService.obtenerPorCategoria(categoriaId));
    }

    /**
     * Endpoint para registrar un nuevo producto en el catálogo técnico.
     * POST /api/v1/productos
     */
    @PostMapping
    @Operation(summary = "Crear nuevo producto", description = "Registra un nuevo producto técnico en la base de datos de TEKTONICA. Requiere rol ADMIN.")
    public ResponseEntity<Producto> crear(@RequestBody @Valid ProductoDTO dto) {
        Producto nuevo = productoService.crearProducto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    /**
     * Endpoint para actualizar los datos de un producto existente.
     * PUT /api/v1/productos/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto existente", description = "Actualiza las especificaciones técnicas de un equipo a partir de su ID. Requiere rol ADMIN.")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody @Valid ProductoDTO dto) {
        Producto actualizado = productoService.actualizarProducto(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    /**
     * Endpoint para desactivar lógicamente un producto del inventario.
     * DELETE /api/v1/productos/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar producto (borrado lógico)", description = "Cambia el estado de un equipo técnico a inactivo. Requiere rol ADMIN.")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        productoService.desactivarProducto(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para alternar (conmutar) el estado activo de un producto del inventario.
     * PATCH /api/v1/productos/{id}/toggle-status
     */
    @PatchMapping("/{id}/toggle-status")
    @Operation(summary = "Alternar estado activo de un producto (toggle)", description = "Permite conmutar el estado lógico de un producto técnico (activo/inactivo) a partir de su ID. Requiere rol ADMIN.")
    public ResponseEntity<Producto> toggleStatus(@PathVariable Long id) {
        Producto modificado = productoService.toggleStatus(id);
        return ResponseEntity.ok(modificado);
    }
}
