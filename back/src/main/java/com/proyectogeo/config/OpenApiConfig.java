package com.proyectogeo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración personalizada de la especificación OpenAPI (Swagger)
 * para el catálogo técnico y leads de cotización de ProyectoGeo.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ProyectoGeo - API REST de Catálogo y Cotizaciones")
                        .version("1.0.0")
                        .description("Especificación técnica de los endpoints de la plataforma de soluciones " +
                                     "tecnológicas geoespaciales y geológicas de ProyectoGeo. Permite el catálogo " +
                                     "y filtrado de productos (GNSS, Óptica, Escáner Láser, Drones) y la " +
                                     "captura de leads/cotizaciones para asesores técnicos.")
                        .contact(new Contact()
                                .name("Soporte Técnico - ProyectoGeo")
                                .email("soporte@proyectogeo.com")
                                .url("https://www.proyectogeo.com")));
    }
}
