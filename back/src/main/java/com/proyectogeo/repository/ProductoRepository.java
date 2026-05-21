package com.proyectogeo.repository;

import com.proyectogeo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad Producto.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Recupera todos los productos que se encuentren activos.
     */
    List<Producto> findByActivoTrue();

    /**
     * Recupera los productos activos que pertenecen a una categoría específica.
     */
    List<Producto> findByCategoriaIdAndActivoTrue(Integer categoriaId);
}
