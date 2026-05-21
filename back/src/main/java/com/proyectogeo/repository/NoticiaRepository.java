package com.proyectogeo.repository;

import com.proyectogeo.model.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio Spring Data JPA para la entidad Noticia.
 */
@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
}
