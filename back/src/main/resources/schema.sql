-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS - PROYECTOGEO
-- Ubicación recomendada: back/src/main/resources/schema.sql
-- ============================================================================

-- Eliminar tablas existentes para garantizar idempotencia al reiniciar la DB
DROP TABLE IF EXISTS cotizaciones CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS noticias CASCADE;

-- ----------------------------------------------------------------------------
-- 1. TABLA: categorias
-- Almacena las categorías principales del catálogo técnico.
-- ----------------------------------------------------------------------------
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar la búsqueda de categorías activas
CREATE INDEX idx_categorias_activo ON categorias(activo);

-- ----------------------------------------------------------------------------
-- 2. TABLA: productos
-- Contiene las especificaciones técnicas e imágenes de los equipos geoespaciales.
-- No incluye campos de precios ni stock transaccional (No es un e-commerce).
-- ----------------------------------------------------------------------------
CREATE TABLE productos (
    id BIGSERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    descripcion_tecnica TEXT NOT NULL,
    url_imagen VARCHAR(500),
    especificaciones VARCHAR(1000),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) 
        REFERENCES categorias(id) ON DELETE RESTRICT
);

-- Índices para búsquedas frecuentes y ordenación en el catálogo
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- ----------------------------------------------------------------------------
-- 3. TABLA: cotizaciones (Leads de Contacto)
-- Registra los datos de los clientes y empresas interesados en productos específicos.
-- ----------------------------------------------------------------------------
CREATE TABLE cotizaciones (
    id BIGSERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    empresa VARCHAR(150),
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    producto_id BIGINT,
    mensaje TEXT NOT NULL,
    atendido BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cotizaciones_producto FOREIGN KEY (producto_id) 
        REFERENCES productos(id) ON DELETE SET NULL
);

-- Índices para el panel de administración / gestión de leads
CREATE INDEX idx_cotizaciones_atendido ON cotizaciones(atendido);
CREATE INDEX idx_cotizaciones_fecha ON cotizaciones(fecha_creacion);


-- ============================================================================
-- INSERCIÓN DE DATOS INICIALES (SEMILLAS / SEED DATA)
-- Carga de categorías iniciales obligatorias y algunos productos de ejemplo
-- ============================================================================

-- Insertar Categorías Principales
INSERT INTO categorias (nombre, descripcion) VALUES
('GNSS', 'Sistemas Globales de Navegación por Satélite de alta precisión para topografía y geodesia.'),
('Óptica', 'Estaciones totales, teodolitos y niveles automáticos de alta fidelidad.'),
('Escáner Láser', 'Tecnología LiDAR terrestre y móvil para captura de nubes de puntos 3D de alta densidad.'),
('Drones', 'Vehículos aéreos no tripulados (UAVs) adaptados para fotogrametría y mapeo aéreo.'),
('Software', 'Soluciones de software especializadas para procesamiento de datos geoespaciales y geológicos.');

-- Insertar Productos de Ejemplo para cada Categoría
INSERT INTO productos (categoria_id, nombre, marca, modelo, descripcion_tecnica, url_imagen, especificaciones) VALUES
(
    1, 
    'Receptor GNSS GeoMax Zenith60', 
    'GeoMax', 
    'Zenith60', 
    'Receptor GNSS inteligente de gama alta. Cuenta con 555 canales, calibración de antena en tiempo real, conectividad 4G LTE y resistencia extrema IP68 contra polvo e inmersión en agua.',
    'https://www.intracgeosystems.com/web/image/21997/Zenith60_rendering__%20right_side_diagonal_blurr.png',
    'Precisión RTK:± 8 mm + 1 ppm, Canales GNSS:555 canales, Protección:IP68 (Sumergible), Batería:Hasta 12 horas'
),
(
    2, 
    'Estación Total Robótica Zoom95', 
    'GeoMax', 
    'Zoom95', 
    'Estación total completamente robótica con tecnología STReAM360 de seguimiento activo de prisma. Precisión angular de 1", alcance de hasta 1000m sin prisma y sistema operativo Windows CE.',
    'https://equiposalfa.mx/wp-content/uploads/Zoom90-WinCE-Servo-Total-Station-with-AiM360-and-TRack360-522-1.webp',
    'Precisión Angular:1", Alcance sin Prisma:Hasta 1000m, Aumento de Lente:30x, Plomada:Láser visible'
),
(
    3, 
    'Escáner Láser 3D Zoller+Fröhlich Imager 5016', 
    'Z+F', 
    'Imager 5016', 
    'Escáner láser terrestre de alta precisión capaz de capturar más de 1 millón de puntos por segundo. Alcance de hasta 360 metros, cámara HDR integrada e iluminación LED para entornos oscuros.',
    'https://img.archiexpo.es/images_ae/photo-mg/153618-10616383.webp',
    'Velocidad Muestreo:1,000,000 pts/s, Alcance Máximo:Hasta 360m, Cámara Integrada:HDR 3D 80 MP, Precisión 3D:1.9mm @ 10m'
),
(
    4, 
    'Dron de Fotogrametría WingtraOne Gen II', 
    'Wingtra', 
    'WingtraOne Gen II', 
    'Dron VTOL (despegue y aterrizaje vertical) de ala fija para mapeo a gran escala. Equipado con cámaras RGB de alta resolución de hasta 42MP y receptor PPK integrado para precisión centimétrica sin puntos de control terrestres.',
    'https://elvuelodeldrone.com/wp-content/uploads/2024/02/Wingtra-One-Gen-1.jpg',
    'Autonomía Vuelo:Hasta 59 min, Sensor de Cámara:42 MP Full-Frame, Cobertura Máxima:400 ha @ 3cm GSD, Precisión Vertical:Hasta 2.0cm'
),
(
    5,
    'X-PAD Ultimate (GeoMax)',
    'GeoMax',
    'Ultimate 3D',
    'Software de campo definitivo para topografía y geomensura en entornos 3D.',
    'https://i.ytimg.com/vi/nexAlE97f9M/maxresdefault.jpg',
    'Plataforma:Windows 10/11 x64, Formatos Entrada:CAD LAS TIFF CSV, Licenciamiento:Perpetuo / Nube, Procesamiento:Modelado y Mallas 3D'
),
(
    5,
    'WingtraHub (Wingtra)',
    'Wingtra',
    'Hub PPK',
    'Estación de control de vuelo y procesamiento PPK de alta precisión para drones.',
    'https://knowledge.wingtra.com/hubfs/Manual%20(Knowledge%20Base)/images/screenshots/WingtraHub0.4.0/wih_install1.png',
    'Plataforma:Windows 10/11 x64, Formatos Entrada:RINEX Wingtra .safe, Licenciamiento:Licencia con equipo Wingtra, Procesamiento:Procesamiento PPK de alta precisión'
),
(
    5,
    'MicroSurvey CAD',
    'MicroSurvey',
    'Desktop Studio',
    'Solución de escritorio para cálculos topográficos y modelado digital de terrenos.',
    'https://globalpos.com.au/cdn/shop/products/MicroSurveyCAD.png?v=1607641422',
    'Plataforma:Windows 10/11 x64, Formatos Entrada:DWG DXF LandXML, Licenciamiento:Perpetuo por llave USB, Procesamiento:Cálculos topográficos y diseño CAD'
);

-- ----------------------------------------------------------------------------
-- 4. TABLA: noticias (Novedades y Artículos Técnicos)
-- Almacena publicaciones y blogs sobre innovaciones tecnológicas de TEKTONICA.
-- ----------------------------------------------------------------------------
CREATE TABLE noticias (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    url_imagen VARCHAR(500),
    subtitulo_secundario TEXT,
    url_video_embebido VARCHAR(500),
    datos_clave VARCHAR(1000)
);

-- Índices para optimizar listado de novedades
CREATE INDEX idx_noticias_fecha ON noticias(fecha);

-- Insertar Novedades de Semilla (con campos editoriales extendidos)
INSERT INTO noticias (titulo, contenido, categoria, url_imagen, subtitulo_secundario, url_video_embebido, datos_clave) VALUES
(
    'Revolución en Fotogrametría Terrestre con LiDAR Móvil',
    '<p>La integración de sistemas de escaneo láser en vehículos terrestres está cambiando la velocidad de modelado digital en zonas urbanas. TEKTONICA presenta las nuevas soluciones integradas Zoller+Fröhlich para alta densidad de nubes de puntos con precisión submilimétrica.</p><h2>¿Qué es el LiDAR Móvil?</h2><p>El LiDAR Móvil (Mobile Laser Scanning) es una tecnología que permite capturar datos 3D de alta densidad desde plataformas en movimiento, como vehículos terrestres, embarcaciones o drones. A diferencia de los escáneres estáticos, el LiDAR móvil registra millones de puntos por segundo mientras se desplaza, lo que reduce drásticamente los tiempos de captura en proyectos de gran escala urbana e infraestructura lineal.</p><h3>Ventajas operacionales clave</h3><ul><li>Velocidad de captura hasta 10x superior al escaneo estático convencional.</li><li>Cobertura continua de kilómetros de carretera o fachada en una sola pasada.</li><li>Integración nativa con receptores GNSS/INS para georreferenciación directa.</li></ul><blockquote>"La precisión submilimétrica del Imager 5016 montado en plataformas móviles ha redefinido los estándares de eficiencia en relevamiento urbano." — Ing. Roberto Fuentes, Director Técnico TEKTONICA.</blockquote>',
    'Escáner Láser',
    'https://images.ctfassets.net/go54bjdzbrgi/1dleNY21rkqeCdeGSJVXz5/c5c8ab2afc0dfce810e11aefcae8fe66/IMA_BLO_CORP_lidar-photogrammetry_lidar_pointcloud.jpg',
    'Cómo la tecnología de escaneo móvil está transformando el modelado 3D urbano a escala industrial',
    'https://www.youtube.com/embed/GLw0Izy2jDQ?si=_eNfGZUabmqU__R9',
    'Precisión:±2mm, Velocidad:1M pts/seg, Alcance:360m, Protección:IP54'
),
(
    'Optimización del flujo PPK en Drones VTOL de ala fija',
    '<p>El procesamiento post-proceso (PPK) elimina la necesidad de establecer costosos puntos de control en tierra en grandes extensiones agrícolas o mineras. En este artículo explicamos paso a paso cómo procesar los datos geodésicos del receptor WingtraOne Gen II usando la estación de software especializada WingtraHub.</p><h2>¿Qué es el procesamiento PPK?</h2><p>PPK (Post-Processed Kinematic) es una técnica de corrección diferencial que permite alcanzar precisiones centimétricas sin necesidad de una conexión RTK en tiempo real. Los datos brutos del receptor GNSS embarcado en el dron se procesan posteriormente contra una estación base, corrigiendo errores atmosféricos e ionosféricos con máxima exactitud.</p><h3>Flujo de trabajo recomendado</h3><ol><li>Planificar la misión de vuelo con parámetros de solapamiento al 80% frontal y 65% lateral.</li><li>Ejecutar el vuelo autónomo con el WingtraOne Gen II en modo PPK.</li><li>Descargar los datos RINEX del receptor embarcado y de la estación base.</li><li>Procesar con WingtraHub para obtener coordenadas corregidas de cada fotografía.</li></ol>',
    'Drones',
    'https://www.airmobi.com/wp-content/uploads/2024/05/Skyeye-2930-VTOL-drone-Banner.jpg',
    'Guía paso a paso para alcanzar precisión centimétrica sin puntos de control terrestre',
    'https://www.youtube.com/embed/D87yy2Y8mSg?si=0jWraXcsuwVnJsIb',
    'Precisión PPK:±2cm, Cobertura:200ha/vuelo, Autonomía:59 min, Sensor:42MP RX1R II'
),
(
    'Receptores GNSS Zenith60: Geodesia de Alta Precisión en Terrenos Extremos',
    '<p>La topografía moderna exige el funcionamiento de receptores GNSS bajo condiciones climáticas y geográficas sumamente severas. El Zenith60 de GeoMax ha demostrado precisión milimétrica en mediciones RTK incluso en cañones profundos y áreas de alta densidad foliar gracias a su avanzado algoritmo de mitigación de multicaminos.</p><h2>Tecnología anti-multicaminos avanzada</h2><p>El algoritmo propietario de GeoMax filtra señales reflejadas por superficies cercanas (edificios, rocas, vegetación densa) y selecciona únicamente la señal directa del satélite. Esto permite mantener fijaciones RTK estables donde otros receptores pierden la solución constantemente.</p><h3>Especificaciones técnicas destacadas</h3><p>El Zenith60 cuenta con 555 canales de seguimiento simultáneo, compatibilidad con todas las constelaciones GNSS activeas (GPS, GLONASS, Galileo, BeiDou, QZSS), conectividad 4G LTE integrada y certificación IP68 para inmersión temporal en agua.</p>',
    'GNSS',
    'https://cm2.pe/wp-content/uploads/2023/12/geodesia-31.jpg',
    'Rendimiento submilimétrico en cañones y zonas de alta densidad foliar',
    'https://www.youtube.com/embed/-bHZJd94z1U?si=uQg8e7DlFRnxxa-w',
    'Canales:555, Precisión RTK:±8mm+1ppm, Conectividad:4G LTE, Protección:IP68'
);
