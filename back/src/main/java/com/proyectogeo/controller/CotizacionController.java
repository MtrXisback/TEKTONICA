package com.proyectogeo.controller;

import com.proyectogeo.dto.CotizacionDTO;
import com.proyectogeo.model.Cotizacion;
import com.proyectogeo.service.CotizacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST encargado de exponer los endpoints relacionados con las Cotizaciones.
 */
@RestController
@RequestMapping("/cotizaciones")
@Tag(name = "Cotizaciones", description = "Controlador encargado de recibir y almacenar cotizaciones o solicitudes de contacto (leads).")
public class CotizacionController {

    private final CotizacionService cotizacionService;

    @Autowired
    public CotizacionController(CotizacionService cotizacionService) {
        this.cotizacionService = cotizacionService;
    }

    /**
     * Endpoint para capturar y almacenar una solicitud de cotización (lead).
     * POST /api/v1/cotizaciones
     */
    @PostMapping
    @Operation(summary = "Registrar una nueva cotización", description = "Recibe los datos del formulario de contacto/cotización (nombre, empresa, correo, teléfono, mensaje y productoId opcional) y los almacena en la base de datos como un lead de cliente interesado.")
    public ResponseEntity<Cotizacion> registrarCotizacion(@RequestBody @Valid CotizacionDTO dto) {
        Cotizacion nuevaCotizacion = cotizacionService.guardar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCotizacion);
    }
}
