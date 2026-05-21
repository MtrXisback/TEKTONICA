package com.proyectogeo.repository;

import com.proyectogeo.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad Categoria.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    
    /**
     * Recupera todas las categorías que se encuentren activas en el sistema.
     */
    List<Categoria> findByActivoTrue();
}
