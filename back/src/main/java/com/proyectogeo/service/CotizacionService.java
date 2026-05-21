package com.proyectogeo.service;

import com.proyectogeo.dto.CotizacionDTO;
import com.proyectogeo.model.Cotizacion;
import com.proyectogeo.model.Producto;
import com.proyectogeo.repository.CotizacionRepository;
import com.proyectogeo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio encargado de gestionar la lógica de negocio para las Cotizaciones.
 */
@Service
@Transactional
public class CotizacionService {

    private final CotizacionRepository cotizacionRepository;
    private final ProductoRepository productoRepository;

    @Autowired
    public CotizacionService(CotizacionRepository cotizacionRepository, ProductoRepository productoRepository) {
        this.cotizacionRepository = cotizacionRepository;
        this.productoRepository = productoRepository;
    }

    /**
     * Procesa y almacena una nueva solicitud de cotización (lead).
     * Si se proporciona un productoId válido, se asocia automáticamente.
     */
    public Cotizacion guardar(CotizacionDTO dto) {
        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setNombreCompleto(dto.getNombreCompleto());
        cotizacion.setEmpresa(dto.getEmpresa());
        cotizacion.setCorreo(dto.getCorreo());
        cotizacion.setTelefono(dto.getTelefono());
        cotizacion.setMensaje(dto.getMensaje());
        cotizacion.setAtendido(false); // Inicia como no atendido por defecto

        // Vincular con producto de interés si se especificó
        if (dto.getProductoId() != null) {
            Producto producto = productoRepository.findById(dto.getProductoId()).orElse(null);
            cotizacion.setProducto(producto);
        }

        return cotizacionRepository.save(cotizacion);
    }
}
