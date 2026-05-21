package com.proyectogeo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de inicio para la API REST del ProyectoGeo.
 * 
 * Esta aplicación gestiona el catálogo de productos de alta tecnología
 * geológica/geoespacial (GNSS, Óptica, Escáner Láser, Drones, Software)
 * y los leads o solicitudes de cotizaciones de clientes interesados.
 */
@SpringBootApplication
public class ProyectoGeoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProyectoGeoApplication.class, args);
    }
}
