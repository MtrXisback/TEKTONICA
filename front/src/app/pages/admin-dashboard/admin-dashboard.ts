import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { NoticiaService } from '../../services/noticia.service';
import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { Noticia } from '../../models/noticia.model';

/**
 * Componente de Consola de Control Administrativo del Catálogo Técnico y Noticias de TEKTONICA.
 * 
 * Implementa el tab switcher lógico, modales de adición y edición, enlazado de datos
 * reactivos mediante [(ngModel)], inyección de servicios y persistencia real con el backend.
 */
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  standalone: false
})
export class AdminDashboardPage implements OnInit {

  // Listas de datos
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  noticias: Noticia[] = [];

  // Pestaña activa lógica
  pestanaActiva: 'equipos' | 'noticias' = 'equipos';

  // Control de estados de carga y error
  cargando: boolean = true;
  errorCarga: boolean = false;
  cargandoNoticias: boolean = false;
  errorNoticias: boolean = false;

  // Estados de modales
  mostrarModalEquipo: boolean = false;
  mostrarModalNoticia: boolean = false;
  modoEdicionEquipo: boolean = false;
  modoEdicionNoticia: boolean = false;
  guardandoEquipo: boolean = false;
  guardandoNoticia: boolean = false;

  // Modelos temporales para formularios de enlace bidireccional
  equipoModelo: Producto = this.generarEquipoVacio();
  noticiaModelo: Noticia = this.generarNoticiaVacia();

  // Mapa de categorías para resolución rápida de nombres por ID
  categoriasMap: Map<number, string> = new Map();

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private noticiaService: NoticiaService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cargarCategorias();
    this.cargarInventario();
    this.cargarNoticias();
  }

  /**
   * Obtiene la cantidad de productos con estado activo en el inventario.
   */
  get productosActivos(): number {
    return this.productos.filter(p => p.activo).length;
  }

  /**
   * Genera un objeto Producto vacío e inicializado.
   */
  private generarEquipoVacio(): Producto {
    return {
      nombre: '',
      marca: '',
      modelo: '',
      categoriaId: 0,
      descripcionTecnica: '',
      urlImagen: '',
      especificaciones: '',
      activo: true
    };
  }

  /**
   * Genera un objeto Noticia vacío e inicializado.
   */
  private generarNoticiaVacia(): Noticia {
    return {
      titulo: '',
      contenido: '',
      categoria: '',
      urlImagen: '',
      subtituloSecundario: '',
      urlVideoEmbebido: '',
      datosClave: ''
    };
  }

  /**
   * Carga el catálogo completo de categorías y construye el mapa de resolución.
   */
  cargarCategorias(): void {
    this.categoriaService.obtenerCategoriasActivas().subscribe({
      next: (cats) => {
        this.categorias = cats;
        cats.forEach(c => {
          if (c.id) {
            this.categoriasMap.set(c.id, c.nombre);
          }
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[AdminDashboard] Error al cargar categorías:', err);
      }
    });
  }

  /**
   * Carga el inventario técnico COMPLETO (activos + inactivos) desde el endpoint administrativo protegido.
   * A diferencia de la vista pública que solo muestra activos, la consola de gestión
   * requiere visibilidad total del inventario para gestionar estados con badges.
   */
  cargarInventario(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.productoService.obtenerInventarioCompleto().subscribe({
      next: (prods) => {
        setTimeout(() => {
          this.productos = prods;
          this.cargando = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('[AdminDashboard] Error al cargar inventario completo:', err);
        setTimeout(() => {
          this.errorCarga = true;
          this.cargando = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  /**
   * Carga la lista de noticias desde la base de datos real del backend.
   */
  cargarNoticias(): void {
    this.cargandoNoticias = true;
    this.errorNoticias = false;

    this.noticiaService.obtenerTodas().subscribe({
      next: (notis) => {
        this.noticias = notis;
        this.cargandoNoticias = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[AdminDashboard] Error al cargar noticias:', err);
        this.errorNoticias = true;
        this.cargandoNoticias = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Resuelve el nombre de una categoría a partir de su ID.
   */
  obtenerNombreCategoria(categoriaId: number): string {
    return this.categoriasMap.get(categoriaId) || 'Sin categoría';
  }

  /**
   * Alterna entre pestañas (equipos vs noticias).
   */
  cambiarPestana(pestana: 'equipos' | 'noticias'): void {
    this.pestanaActiva = pestana;
    this.cdr.detectChanges();
  }

  /**
   * Abre el modal para agregar un equipo nuevo inicializado.
   */
  abrirModalCrearEquipo(): void {
    this.modoEdicionEquipo = false;
    this.equipoModelo = this.generarEquipoVacio();
    
    // Asignar primer categoría activa si existe
    if (this.categorias.length > 0 && this.categorias[0].id) {
      this.equipoModelo.categoriaId = this.categorias[0].id;
    }
    
    this.mostrarModalEquipo = true;
    this.cdr.detectChanges();
  }

  /**
   * Abre el modal en modo edición para un equipo existente, clonando sus valores y resolviendo el ID de categoría.
   */
  abrirModalEditarEquipo(producto: Producto): void {
    this.modoEdicionEquipo = true;
    this.equipoModelo = { 
      ...producto,
      categoriaId: producto.categoria?.id || 0,
      especificaciones: producto.especificaciones || ''
    };
    this.mostrarModalEquipo = true;
    this.cdr.detectChanges();
  }

  /**
   * Cierra el modal de equipo y restablece su modelo temporal.
   */
  cerrarModalEquipo(): void {
    this.mostrarModalEquipo = false;
    this.equipoModelo = this.generarEquipoVacio();
    this.cdr.detectChanges();
  }

  /**
   * Envía la información técnica del formulario para registrar o actualizar el equipo.
   */
  onSubmitEquipo(): void {
    if (!this.equipoModelo.nombre || !this.equipoModelo.marca || !this.equipoModelo.modelo || !this.equipoModelo.categoriaId) {
      return;
    }

    this.guardandoEquipo = true;
    this.equipoModelo.categoriaId = Number(this.equipoModelo.categoriaId); // Asegura tipado numérico

    if (this.modoEdicionEquipo && this.equipoModelo.id) {
      this.productoService.actualizarProducto(this.equipoModelo.id, this.equipoModelo).subscribe({
        next: () => {
          this.guardandoEquipo = false;
          this.cerrarModalEquipo();
          this.cargarInventario();
        },
        error: (err) => {
          console.error('[AdminDashboard] Error al actualizar equipo:', err);
          this.guardandoEquipo = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productoService.crearProducto(this.equipoModelo).subscribe({
        next: () => {
          this.guardandoEquipo = false;
          this.cerrarModalEquipo();
          this.cargarInventario();
        },
        error: (err) => {
          console.error('[AdminDashboard] Error al crear equipo:', err);
          this.guardandoEquipo = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  /**
   * Alterna el estado operacional del equipo, aplicando la conmutación atómica
   * de estado (toggle) consumiendo PATCH /productos/{id}/toggle-status de forma segura.
   */
  toggleEstadoEquipo(producto: Producto): void {
    if (!producto.id) return;

    this.productoService.toggleStatusProducto(producto.id).subscribe({
      next: (prodModificado) => {
        producto.activo = prodModificado.activo;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[AdminDashboard] Error al conmutar estado del equipo:', err);
      }
    });
  }

  /**
   * Abre el modal para crear un artículo o novedad técnica.
   */
  abrirModalCrearNoticia(): void {
    this.modoEdicionNoticia = false;
    this.noticiaModelo = this.generarNoticiaVacia();
    
    // Seleccionar por defecto la primera área/categoría disponible
    if (this.categorias.length > 0) {
      this.noticiaModelo.categoria = this.categorias[0].nombre;
    } else {
      this.noticiaModelo.categoria = 'General';
    }
    
    this.mostrarModalNoticia = true;
    this.cdr.detectChanges();
  }

  /**
   * Abre el modal en modo edición para una noticia existente, clonando sus valores.
   */
  abrirModalEditarNoticia(noticia: Noticia): void {
    this.modoEdicionNoticia = true;
    this.noticiaModelo = { ...noticia };
    this.mostrarModalNoticia = true;
    this.cdr.detectChanges();
  }

  /**
   * Cierra el modal de noticias y reinicia su modelo.
   */
  cerrarModalNoticia(): void {
    this.mostrarModalNoticia = false;
    this.modoEdicionNoticia = false;
    this.noticiaModelo = this.generarNoticiaVacia();
    this.cdr.detectChanges();
  }

  /**
   * Guarda y publica la noticia consumiendo POST /noticias (creación) o PUT /noticias/{id} (edición).
   */
  onSubmitNoticia(): void {
    if (!this.noticiaModelo.titulo || !this.noticiaModelo.contenido || !this.noticiaModelo.categoria) {
      return;
    }

    this.guardandoNoticia = true;

    if (this.modoEdicionNoticia && this.noticiaModelo.id) {
      this.noticiaService.actualizarNoticia(this.noticiaModelo.id, this.noticiaModelo).subscribe({
        next: () => {
          this.guardandoNoticia = false;
          this.cerrarModalNoticia();
          this.cargarNoticias();
        },
        error: (err) => {
          console.error('[AdminDashboard] Error al actualizar noticia:', err);
          this.guardandoNoticia = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.noticiaService.crearNoticia(this.noticiaModelo).subscribe({
        next: () => {
          this.guardandoNoticia = false;
          this.cerrarModalNoticia();
          this.cargarNoticias();
        },
        error: (err) => {
          console.error('[AdminDashboard] Error al crear noticia:', err);
          this.guardandoNoticia = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  /**
   * Remueve permanentemente una noticia mediante eliminación física (DELETE /noticias/{id}).
   */
  eliminarNoticia(noticia: Noticia): void {
    if (!noticia.id) return;

    const confirmacion = confirm(`¿Está seguro de que desea eliminar físicamente la publicación "${noticia.titulo}"? Esta acción no se puede deshacer.`);
    if (confirmacion) {
      this.noticiaService.eliminarNoticia(noticia.id).subscribe({
        next: () => {
          this.cargarNoticias();
        },
        error: (err) => {
          console.error('[AdminDashboard] Error al eliminar noticia físicamente:', err);
        }
      });
    }
  }

  /**
   * Cierra la sesión del operador y redirige al panel de login.
   */
  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  /**
   * Optimización del renderizado de listas en directivas *ngFor.
   */
  trackByProductoId(index: number, producto: Producto): number | undefined {
    return producto.id;
  }

  trackByNoticiaId(index: number, noticia: Noticia): number | undefined {
    return noticia.id;
  }
}
