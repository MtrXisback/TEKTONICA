import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NoticiaService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';

/**
 * Página de Inicio de alto impacto visual (Landing Page).
 * Presenta las áreas industriales, servicios y tecnologías del ProyectoGeo.
 *
 * Las novedades y artículos técnicos se cargan de forma 100% dinámica desde la base
 * de datos del backend, con paginación progresiva de 3 en 3 y ordenamiento cronológico
 * descendente (de la más reciente a la más antigua).
 */
@Component({
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  standalone: false
})
export class LandingPage implements OnInit, AfterViewInit {

  /** Array maestro de noticias cargadas desde el backend. */
  noticias: Noticia[] = [];

  /** Límite de noticias visibles en la grilla (incrementable de 3 en 3). */
  limiteVisible: number = 3;

  /** Indicadores de carga y error para la sección de novedades. */
  cargandoNoticias: boolean = true;
  errorNoticias: boolean = false;

  constructor(
    private noticiaService: NoticiaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // La carga pesada se delega a ngAfterViewInit para evitar errores NG0100.
  }

  ngAfterViewInit(): void {
    this.cargarNoticias();
  }

  /**
   * Carga las noticias desde la API y las ordena cronológicamente (recientes primero).
   */
  private cargarNoticias(): void {
    this.cargandoNoticias = true;
    this.errorNoticias = false;

    this.noticiaService.obtenerTodas().subscribe({
      next: (notis) => {
        // Ordenar de la más reciente a la más antigua por fecha de publicación
        this.noticias = notis.sort((a, b) => {
          const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
          const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
          return fechaB - fechaA;
        });
        this.cargandoNoticias = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[LandingPage] Error al cargar noticias desde el backend:', err);
        this.errorNoticias = true;
        this.cargandoNoticias = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Incrementa el límite de noticias visibles en la grilla de 3 en 3.
   * Ejecutado por el botón evaluador «Explorar más artículos».
   */
  mostrarMasNoticias(): void {
    this.limiteVisible += 3;
    this.cdr.detectChanges();
  }

  /**
   * Determina si el recurso multimedia de una noticia es un video (MP4/WebM).
   */
  esVideo(url: string | undefined): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg');
  }

  /**
   * Formatea una fecha ISO a un string legible en español.
   * Ejemplo: '2026-05-18T...' → '18 de Mayo, 2026'
   */
  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '';
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return `${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
  }
}
