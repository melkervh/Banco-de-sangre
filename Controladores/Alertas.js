function actualizarDatos(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
  if (window.generarAlertas) window.generarAlertas();
  document.dispatchEvent(new Event("datosActualizados"));
}
