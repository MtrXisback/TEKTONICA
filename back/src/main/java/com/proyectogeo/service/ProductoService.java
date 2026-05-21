package com.proyectogeo.service;

import com.proyectogeo.dto.ProductoDTO;
import com.proyectogeo.model.Categoria;
import com.proyectogeo.model.Producto;
import com.proyectogeo.repository.CategoriaRepository;
import com.proyectogeo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Servicio encargado de gestionar la lógica de negocio para los Productos.
 */
@Service
@Transactional(readOnly = true)
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Autowired
    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Obtiene el listado de todos los productos activos.
     * Usado exclusivamente por la vista pública del catálogo técnico.
     */
    public List<Producto> obtenerTodosActivos() {
        return productoRepository.findByActivoTrue();
    }

    /**
     * Obtiene el inventario completo de productos (activos e inactivos).
     * Usado exclusivamente por la consola administrativa del operador.
     * Requiere autenticación ADMIN en el controlador.
     */
    public List<Producto> obtenerTodosParaAdmin() {
        return productoRepository.findAll();
    }

    /**
     * Obtiene la lista de productos activos filtrada por una categoría específica.
     */
    public List<Producto> obtenerPorCategoria(Integer categoriaId) {
        return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId);
    }

    /**
     * Registra un nuevo producto en la base de datos PostgreSQL.
     */
    @Transactional(readOnly = false)
    public Producto crearProducto(ProductoDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + dto.getCategoriaId()));

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setMarca(dto.getMarca());
        producto.setModelo(dto.getModelo());
        producto.setDescripcionTecnica(dto.getDescripcionTecnica());
        producto.setUrlImagen(dto.getUrlImagen());
        producto.setEspecificaciones(dto.getEspecificaciones());
        producto.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        producto.setCategoria(categoria);

        return productoRepository.save(producto);
    }

    /**
     * Actualiza los datos técnicos de un producto existente.
     */
    @Transactional(readOnly = false)
    public Producto actualizarProducto(Long id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + dto.getCategoriaId()));

        producto.setNombre(dto.getNombre());
        producto.setMarca(dto.getMarca());
        producto.setModelo(dto.getModelo());
        producto.setDescripcionTecnica(dto.getDescripcionTecnica());
        producto.setUrlImagen(dto.getUrlImagen());
        producto.setEspecificaciones(dto.getEspecificaciones());
        if (dto.getActivo() != null) {
            producto.setActivo(dto.getActivo());
        }
        producto.setCategoria(categoria);

        return productoRepository.save(producto);
    }

    /**
     * Realiza una desactivación lógica en la base de datos (activo = false).
     */
    @Transactional(readOnly = false)
    public void desactivarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    /**
     * Alterna el estado activo/inactivo (toggle) de un producto técnico.
     */
    @Transactional(readOnly = false)
    public Producto toggleStatus(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + id));
        producto.setActivo(!Boolean.TRUE.equals(producto.getActivo()));
        return productoRepository.save(producto);
    }
}
