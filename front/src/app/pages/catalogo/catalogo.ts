import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { Categoria } from '../../models/categoria.model';
import { Producto } from '../../models/producto.model';

/**
 * Página de Catálogo Técnico con filtrado interactivo lateral.
 * Permite listar dinámicamente productos por su categoría o mostrar todos los equipos.
 */
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
  standalone: false
})
export class CatalogoPage implements OnInit, AfterViewInit {
  
  categorias: Categoria[] = [];
  productos: Producto[] = [];
  
  // Caché local para búsquedas dinámicas sin golpear repetidamente la base de datos
  productosOriginales: Producto[] = [];
  
  // Término de búsqueda en tiempo real
  terminoBusqueda: string = '';
  
  // Registro de IDs de productos cuyas fichas técnicas rápidas están abiertas
  tarjetasExpandidas: Set<number> = new Set<number>();
  
  // Categoría actualmente activa en el filtro (null representa "Todos los Productos")
  categoriaSeleccionada: Categoria | null = null;
  
  cargandoCategorias: boolean = true;
  cargandoProductos: boolean = true;
  errorCarga: boolean = false;

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // La inicialización pesada se delega a ngAfterViewInit para evitar errores NG0100.
  }

  ngAfterViewInit(): void {
    this.inicializarCatalogo();
  }

  /**
   * Ejecuta la carga paralela de categorías y todos los productos inicialmente.
   */
  inicializarCatalogo(): void {
    this.errorCarga = false;
    this.cargandoCategorias = true;
    this.cargandoProductos = true;

    // Cargar menú lateral de categorías
    this.categoriaService.obtenerCategoriasActivas().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.cargandoCategorias = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.errorCarga = true;
        this.cargandoCategorias = false;
        this.cdr.detectChanges();
      }
    });

    // Cargar grilla inicial con todos los productos disponibles
    this.mostrarTodosLosProductos();
  }

  /**
   * Carga la totalidad de productos activos de la plataforma.
   */
  mostrarTodosLosProductos(): void {
    this.cargandoProductos = true;
    this.categoriaSeleccionada = null;
    this.terminoBusqueda = '';
    this.tarjetasExpandidas.clear();

    this.productoService.obtenerTodosLosProductos().subscribe({
      next: (prods) => {
        this.productosOriginales = prods;
        this.productos = prods;
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar todos los productos:', err);
        this.errorCarga = true;
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Filtra dinámicamente los productos al seleccionar una categoría del menú lateral.
   */
  filtrarPorCategoria(categoria: Categoria): void {
    if (!categoria.id) return;
    
    this.cargandoProductos = true;
    this.categoriaSeleccionada = categoria;
    this.terminoBusqueda = '';
    this.tarjetasExpandidas.clear();

    this.productoService.obtenerProductosPorCategoria(categoria.id).subscribe({
      next: (prods) => {
        this.productosOriginales = prods;
        this.productos = prods;
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`Error al cargar productos de la categoría ${categoria.nombre}:`, err);
        this.errorCarga = true;
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Realiza un filtrado dinámico local basado en texto a medida que el usuario escribe.
   * Busca coincidencias en nombre, marca, modelo o descripción del equipo.
   */
  filtrarProductosPorTexto(): void {
    const texto = this.terminoBusqueda.toLowerCase().trim();
    if (!texto) {
      this.productos = [...this.productosOriginales];
      this.cdr.detectChanges();
      return;
    }

    this.productos = this.productosOriginales.filter(prod => 
      prod.nombre.toLowerCase().includes(texto) ||
      prod.marca.toLowerCase().includes(texto) ||
      prod.modelo.toLowerCase().includes(texto) ||
      prod.descripcionTecnica.toLowerCase().includes(texto) ||
      (prod.categoria?.nombre && prod.categoria.nombre.toLowerCase().includes(texto))
    );
    this.cdr.detectChanges();
  }

  /**
   * Alterna la expansión/colapso de la ficha técnica de un producto individual.
   */
  toggleFichaRapida(productoId: number | undefined): void {
    if (productoId === undefined) return;
    
    if (this.tarjetasExpandidas.has(productoId)) {
      this.tarjetasExpandidas.delete(productoId);
    } else {
      this.tarjetasExpandidas.add(productoId);
    }
    this.cdr.detectChanges();
  }

  /**
   * Verifica si la tarjeta de un producto específico debe mostrar las especificaciones.
   */
  estaTarjetaExpandida(productoId: number | undefined): boolean {
    if (productoId === undefined) return false;
    return this.tarjetasExpandidas.has(productoId);
  }

  /**
   * Parsea la cadena estructurada de especificaciones a un array de objetos clave-valor.
   */
  parsearEspecificaciones(specStr?: string): { clave: string, valor: string }[] {
    if (!specStr) return [];
    return specStr.split(',').map(item => {
      const parts = item.split(':');
      return {
        clave: parts[0]?.trim() || '',
        valor: parts.slice(1).join(':')?.trim() || '' // Soporta dos puntos dentro del valor
      };
    }).filter(spec => spec.clave && spec.valor);
  }
}
