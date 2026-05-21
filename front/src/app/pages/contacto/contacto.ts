import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CotizacionService } from '../../services/cotizacion.service';
import { Cotizacion } from '../../models/cotizacion.model';

/**
 * Página de Contacto / Formulario de Cotización.
 * Captura leads de clientes e integra el envío seguro hacia el Backend.
 */
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
  standalone: false
})
export class ContactoPage implements OnInit {
  
  nombreCompleto: string = '';
  empresa: string = '';
  correo: string = '';
  telefono: string = '';
  categoriaInteres: string = '';
  productoId: number | null = null;
  mensaje: string = '';
  
  enviado: boolean = false;
  errorEnvio: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit(): void {
    // Capturar parámetros sugeridos desde el catálogo técnico
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.categoriaInteres = params['categoria'];
        this.mensaje = `Hola, estoy interesado en obtener información y cotización sobre equipos de la división: ${this.categoriaInteres}.`;
      }
      if (params['productoId']) {
        this.productoId = +params['productoId'];
      }
      if (params['producto']) {
        this.mensaje = `Hola, estoy muy interesado en solicitar una cotización formal y ficha técnica detallada del equipo: ${params['producto']} (${this.categoriaInteres}).`;
      }
    });
  }

  /**
   * Envía la cotización al backend en Spring Boot para persistencia física.
   */
  enviarFormulario(contactoForm: any): void {
    if (contactoForm.invalid) {
      return;
    }

    this.errorEnvio = false;

    // Crear el payload que coincide exactamente con el DTO del Backend
    const payload: Cotizacion = {
      nombreCompleto: this.nombreCompleto,
      empresa: this.empresa || undefined,
      correo: this.correo,
      telefono: this.telefono,
      mensaje: this.mensaje,
      productoId: this.productoId ? this.productoId : undefined
    };

    console.log('Enviando lead al servidor:', payload);
    
    this.cotizacionService.enviarCotizacion(payload).subscribe({
      next: (res) => {
        console.log('Respuesta exitosa del servidor:', res);
        this.enviado = true;
        
        // Limpiar el formulario y estados
        contactoForm.resetForm();
        this.categoriaInteres = '';
        this.productoId = null;
      },
      error: (err) => {
        console.error('Error al persistir la cotización en el backend:', err);
        this.errorEnvio = true;
        alert('Hubo un inconveniente al enviar su solicitud. Por favor, intente nuevamente o verifique que el servidor backend esté encendido.');
      }
    });
  }
}
