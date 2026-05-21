package com.proyectogeo.service;

import com.proyectogeo.model.Categoria;
import com.proyectogeo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * Servicio encargado de gestionar la lógica de negocio para las Categorías.
 */
@Service
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Obtiene el listado completo de categorías disponibles en el sistema.
     */
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }

    /**
     * Obtiene únicamente las categorías activas (útil para vistas públicas).
     */
    public List<Categoria> obtenerActivas() {
        return categoriaRepository.findByActivoTrue();
    }
}
