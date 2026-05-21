package com.proyectogeo.repository;

import com.proyectogeo.model.Cotizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio Spring Data JPA para la entidad Cotizacion.
 */
@Repository
public interface CotizacionRepository extends JpaRepository<Cotizacion, Long> {
}
