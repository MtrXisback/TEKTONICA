package com.proyectogeo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para la captura de solicitudes de Cotización (Leads) desde el frontend con validaciones rigurosas.
 */
@Data
public class CotizacionDTO {

    @NotBlank(message = "El nombre completo no puede estar vacío.")
    @Size(max = 150, message = "El nombre completo no puede superar los 150 caracteres.")
    private String nombreCompleto;

    @Size(max = 150, message = "El nombre de la empresa no puede superar los 150 caracteres.")
    private String empresa;

    @NotBlank(message = "El correo electrónico es obligatorio.")
    @Email(message = "El formato del correo electrónico no es válido.")
    @Size(max = 150, message = "El correo electrónico no puede superar los 150 caracteres.")
    private String correo;

    @NotBlank(message = "El teléfono es obligatorio.")
    @Size(max = 50, message = "El teléfono no puede superar los 50 caracteres.")
    private String telefono;

    @NotBlank(message = "El mensaje no puede estar vacío.")
    @Size(max = 2000, message = "El mensaje no puede superar los 2000 caracteres.")
    private String mensaje;

    private Long productoId; // Opcional, ID del producto de interés
}
