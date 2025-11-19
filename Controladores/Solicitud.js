// --- Datos en memoria/localStorage ---
let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

// --- Esperar DOM listo por seguridad ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSolicitud");
  const tablaBody = document.querySelector("tbody");

  if (!form || !tablaBody) {
    console.error("No se encontró el formulario o la tabla.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const paciente = document.getElementById("paciente").value.trim();
    const tipo = document.getElementById("tipo").value;
    const unidades = document.getElementById("unidades").value;
    const urgencia = document.getElementById("urgencia").value;
    const hospital = document.getElementById("hospital").value.trim();
    const fecha = document.getElementById("fecha").value;

    if (!paciente || !hospital || !fecha) {
      mostrarAlerta("Campos incompletos", "Por favor llena todos los campos obligatorios", "warning");
      return;
    }

    const nuevaSolicitud = {
      id: Date.now(), // id único
      paciente, tipo,
      unidades: Number(unidades) || 0,
      urgencia, hospital, fecha,
      estado: "Pendiente",
    };

    solicitudes.push(nuevaSolicitud);
    localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
    mostrarSolicitudes();
    form.reset();
    mostrarAlerta("¡Guardado!", "La solicitud fue registrada correctamente", "success");
  });

  window.cambiarEstado = (index, nuevoEstado) => {
    solicitudes[index].estado = nuevoEstado;
    localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
    mostrarSolicitudes();
    mostrarAlerta("Estado actualizado", `La solicitud fue marcada como ${nuevoEstado}`, "info");
  };

  window.eliminarSolicitud = (index) => {
    confirmarAccion("¿Estás seguro?", "Esta acción no se puede deshacer", "warning", () => {
      solicitudes.splice(index, 1);
      localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
      mostrarSolicitudes();
      mostrarAlerta("Eliminado", "La solicitud fue eliminada correctamente", "success");
    });
  };

  window.exportarPDF = () => {
    // ejemplo básico con jsPDF
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      mostrarAlerta("PDF no disponible", "No se encontró jsPDF", "error");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Historial de solicitudes", 10, 10);

    let y = 20;
    solicitudes.forEach((s, i) => {
      doc.text(
        `${i + 1}. ${s.paciente} | ${s.tipo} | ${s.unidades}u | ${s.urgencia} | ${s.hospital} | ${s.fecha} | ${s.estado}`,
        10, y
      );
      y += 8;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    doc.save("solicitudes.pdf");
    mostrarAlerta("Exportado", "Se generó el PDF correctamente", "success");
  };

  window.exportarExcel = () => {
    if (!window.XLSX) {
      mostrarAlerta("Excel no disponible", "No se encontró SheetJS (XLSX)", "error");
      return;
    }
    const datos = solicitudes.map((s, i) => ({
      "#": i + 1,
      "Paciente": s.paciente,
      "Tipo": s.tipo,
      "Unidades": s.unidades,
      "Urgencia": s.urgencia,
      "Hospital": s.hospital,
      "Fecha": s.fecha,
      "Estado": s.estado,
    }));
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Solicitudes");
    XLSX.writeFile(libro, "solicitudes.xlsx");
    mostrarAlerta("Exportado", "Se generó el Excel correctamente", "success");
  };

  function mostrarSolicitudes() {
    tablaBody.innerHTML = "";
    solicitudes.forEach((s, i) => {
      const fila = document.createElement("tr");
      const badgeClass =
        s.estado === "Pendiente" ? "bg-warning text-dark" :
        s.estado === "Aprobada" ? "bg-success" : "bg-secondary";

      fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${s.paciente}</td>
        <td>${s.tipo}</td>
        <td>${s.unidades}</td>
        <td>${s.urgencia}</td>
        <td>${s.hospital}</td>
        <td>${s.fecha}</td>
        <td><span class="badge ${badgeClass}">${s.estado}</span></td>
        <td class="d-flex gap-1">
          <button class="btn btn-aqua btn-sm btn-accion" onclick="cambiarEstado(${i}, 'Aprobada')">Aprobar</button>
          <button class="btn btn-secondary btn-sm btn-accion" onclick="cambiarEstado(${i}, 'Rechazada')">Rechazar</button>
          <button class="btn btn-eliminar btn-sm btn-accion" onclick="eliminarSolicitud(${i})">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  // Inicializar tabla
  mostrarSolicitudes();
});

// --- SweetAlert helpers ---
function mostrarAlerta(titulo, mensaje, tipo) {
  if (window.Swal) Swal.fire(titulo, mensaje, tipo);
  else alert(`${titulo}\n${mensaje}`);
}

function confirmarAccion(titulo, mensaje, tipo, callback) {
  if (window.Swal) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: tipo,
      showCancelButton: true,
      confirmButtonColor: "#00c8a5",
      cancelButtonColor: "#d9534f",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    }).then((r) => r.isConfirmed && callback());
  } else {
    const ok = confirm(`${titulo}\n${mensaje}`);
    if (ok) callback();
  }
}
// Nueva solicitud
solicitudes.push(nuevaSolicitud);
actualizarDatos("solicitudes", solicitudes);

// Cambiar estado
solicitudes[index].estado = "Rechazada"; // o "Aprobada"
actualizarDatos("solicitudes", solicitudes);

// Eliminar solicitud
solicitudes = solicitudes.filter(s => s.id !== id);
actualizarDatos("solicitudes", solicitudes);
