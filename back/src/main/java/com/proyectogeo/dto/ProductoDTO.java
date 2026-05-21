package com.proyectogeo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO para la captura y transferencia de datos técnicos de productos desde el panel administrativo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {

    @NotBlank(message = "El nombre del producto no puede estar vacío.")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres.")
    private String nombre;

    @NotBlank(message = "La marca del producto no puede estar vacía.")
    @Size(max = 100, message = "La marca no puede superar los 100 caracteres.")
    private String marca;

    @NotBlank(message = "El modelo del producto no puede estar vacío.")
    @Size(max = 100, message = "El modelo no puede superar los 100 caracteres.")
    private String modelo;

    @NotBlank(message = "La descripción técnica es obligatoria.")
    private String descripcionTecnica;

    @Size(max = 500, message = "La URL de la imagen no puede superar los 500 caracteres.")
    private String urlImagen;

    @Size(max = 1000, message = "Las especificaciones no pueden superar los 1000 caracteres.")
    private String especificaciones;

    private Boolean activo = true;

    @NotNull(message = "La categoría del producto es obligatoria.")
    private Integer categoriaId;
}
