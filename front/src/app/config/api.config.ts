/**
 * Configuración de API Dinámica para TEKTONICA
 * 
 * Permite alternar automáticamente entre el servidor de desarrollo local
 * y el Proxy Reverso en producción basado en el hostname del navegador.
 */
export const getApiUrl = (endpoint: string): string => {
  // Si estamos en desarrollo local (ng serve en localhost), usamos el puerto 8080.
  // En producción (sslip.io, nip.io o dominio de producción), usamos la ruta relativa del Proxy Reverso.
  const host = window.location.hostname === 'localhost' ? 'http://localhost:8080' : '';
  return `${host}/api/v1/${endpoint}`;
};
