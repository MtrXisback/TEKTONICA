import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { NoticiaService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';

/**
 * Página de Detalle de Artículo / Novedad Técnica de TEKTONICA.
 *
 * Captura el ID de la ruta activa de forma asíncrona, consume el endpoint
 * público GET /api/v1/noticias/{id}, sanitiza el contenido HTML enriquecido
 * y fuerza el ciclo de renderizado mediante ChangeDetectorRef (CDR).
 *
 * Incluye soporte para:
 * - Video embebido (YouTube/Vimeo) con sanitización de URL.
 * - Ficha técnica parseada desde cadena clave:valor.
 * - Subtítulo editorial secundario.
 */
@Component({
  selector: 'app-noticia-detalle',
  templateUrl: './noticia-detalle.html',
  styleUrl: './noticia-detalle.css',
  standalone: false
})
export class NoticiaDetallePage implements OnInit {

  /** Noticia cargada desde el backend. */
  noticia: Noticia | null = null;

  /** Indicadores de estado asíncrono. */
  cargando: boolean = true;
  noEncontrada: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (!id || isNaN(id)) {
        this.noEncontrada = true;
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }
      this.cargarNoticia(id);
    });
  }

  /**
   * Carga la noticia desde la API REST por su ID.
   */
  private cargarNoticia(id: number): void {
    this.cargando = true;
    this.noEncontrada = false;
    this.cdr.detectChanges();

    this.noticiaService.obtenerNoticiaPorId(id).subscribe({
      next: (noticia) => {
        this.noticia = noticia;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[NoticiaDetalle] Error al cargar artículo:', err);
        this.noEncontrada = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Sanea y transforma de forma segura el texto enriquecido para usar con [innerHTML].
   */
  getContenidoSeguro(contenido: string | undefined): SafeHtml {
    if (!contenido) return '';
    return this.sanitizer.bypassSecurityTrustHtml(contenido);
  }

  /**
   * Sanitiza una URL de video embebido (YouTube/Vimeo) para evitar bloqueos
   * de seguridad de Angular al inyectarla en un <iframe>.
   */
  getIframeUrl(url: string | undefined): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url || '');
  }

  /**
   * Parsea la cadena 'datosClave' del backend y la convierte en una matriz
   * de objetos {clave, valor} legibles para el template HTML.
   *
   * Formato esperado: "Precisión:±2mm, Autonomía:45 min, Protección:IP67"
   * Resultado: [{clave: 'Precisión', valor: '±2mm'}, ...]
   */
  getFichaTecnica(): Array<{ clave: string; valor: string }> {
    if (!this.noticia?.datosClave) return [];
    return this.noticia.datosClave
      .split(',')
      .map(par => {
        const [clave, ...valorParts] = par.trim().split(':');
        return {
          clave: (clave || '').trim(),
          valor: (valorParts.join(':') || '').trim()
        };
      })
      .filter(item => item.clave && item.valor);
  }

  /**
   * Determina si el recurso multimedia es un video (MP4/WebM).
   */
  esVideo(url: string | undefined): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg');
  }

  /**
   * Formatea una fecha ISO a un string legible en español.
   */
  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '';
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return `${d.getDate()} de ${meses[d.getMonth()]} del ${d.getFullYear()}`;
  }

  /**
   * Navega de vuelta a la página de inicio.
   */
  volverAInicio(): void {
    this.router.navigate(['/']);
  }
}