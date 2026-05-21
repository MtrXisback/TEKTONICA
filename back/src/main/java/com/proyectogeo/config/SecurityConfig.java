package com.proyectogeo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuración de seguridad global para el backend del ProyectoGeo utilizando Spring Security.
 * Configura las reglas de autorización para la API REST y la documentación de Swagger.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Configuración de CORS basada en el bean global definido abajo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Desactivación de CSRF ya que la API es sin estado (stateless) y no utiliza cookies
            .csrf(csrf -> csrf.disable())
            
            // 3. Establecer la política de creación de sesión como Stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Configurar las reglas de autorización de las peticiones HTTP
            .authorizeHttpRequests(auth -> auth
                // Ruta administrativa protegida: inventario completo (activos + inactivos)
                .requestMatchers(HttpMethod.GET, "/productos/admin/**").hasRole("ADMIN")
                
                // Rutas públicas de lectura del Catálogo Técnico (solo equipos activos)
                .requestMatchers(HttpMethod.GET, "/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/noticias/**").permitAll()
                
                // Permitir la visualización de la consola de Swagger y OpenAPI de forma pública
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/swagger-ui.html").permitAll()
                
                // Permitir el envío público de cotizaciones (leads de contacto en la landing page)
                // Esto elimina la necesidad de credenciales expuestas en texto plano en el frontend
                .requestMatchers(HttpMethod.POST, "/cotizaciones").permitAll()
                
                // Asegurar las mutaciones administrativas de productos (POST, PUT, DELETE, PATCH)
                // Requiere estrictamente el rol ADMIN
                .requestMatchers(HttpMethod.POST, "/productos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/productos/**").hasRole("ADMIN")
                
                // Asegurar las mutaciones administrativas del módulo de noticias (POST, PUT, DELETE)
                // Requiere estrictamente el rol ADMIN
                .requestMatchers(HttpMethod.POST, "/noticias").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/noticias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/noticias/**").hasRole("ADMIN")
                
                // Cualquier otra petición debe estar autenticada
                .anyRequest().authenticated()
            )
            
            // 5. Habilitar autenticación básica (Basic Auth) para el consumo de endpoints asegurados
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    /**
     * Define múltiples usuarios en memoria en tiempo de desarrollo.
     * Soporta tanto al consumidor de cotizaciones del frontend como al administrador.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails frontendUser = User.builder()
            .username("geo_frontend_user")
            .password("{noop}geo_secure_token_2026")
            .roles("FRONTEND_APP")
            .build();

        UserDetails adminUser = User.builder()
            .username("admin")
            .password("{noop}tektonica_admin_2026")
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(frontendUser, adminUser);
    }

    /**
     * Define la configuración global de CORS para permitir la comunicación bidireccional y segura
     * con el frontend de Angular (http://localhost:4200) sin bloqueos del navegador.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir origen específico del frontend de Angular
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        
        // Métodos HTTP permitidos para la interacción con la API
        configuration.setAllowedMethods(List.of("GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"));
        
        // Cabeceras HTTP permitidas en las peticiones entrantes
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        
        // Cabeceras que el backend expone al cliente
        configuration.setExposedHeaders(List.of("Authorization"));
        
        // Permitir el envío de credenciales (Basic Auth headers, etc.)
        configuration.setAllowCredentials(true);
        
        // Registrar la configuración para todas las rutas del backend
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
