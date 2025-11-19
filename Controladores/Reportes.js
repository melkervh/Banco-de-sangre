document.addEventListener("DOMContentLoaded", () => {
  const tipoSelect = document.getElementById("tipoReporte");
  const btnGenerar = document.getElementById("btnGenerar");
  const btnPDF = document.getElementById("btnPDF");
  const btnExcel = document.getElementById("btnExcel");
  const tbody = document.getElementById("tablaReportes");
  const thead = document.getElementById("tablaHead");

  function limpiarTabla() {
    tbody.innerHTML = "";
    thead.innerHTML = "";
  }

  function generarReporte() {
    const tipo = tipoSelect.value;
    const donaciones = JSON.parse(localStorage.getItem("donaciones")) || [];
    const campañas = JSON.parse(localStorage.getItem("campañas")) || [];

    limpiarTabla();
    let filas = 0;

    // --- Inventario general ---
    if (tipo === "Inventario general") {
      thead.innerHTML = `
        <tr>
          <th>#</th>
          <th>Donante</th>
          <th>Tipo de sangre</th>
          <th>Fecha</th>
          <th>Campaña / Hospital</th>
          <th>Cantidad</th>
          <th>Notas</th>
        </tr>`;
      donaciones.forEach((d, i) => {
        const fila = `
          <tr>
            <td>${i + 1}</td>
            <td>${d.donante}</td>
            <td>${d.tipo}</td>
            <td>${d.fecha}</td>
            <td>${d.campaña || d.hospital || "—"}</td>
            <td>${d.cantidad || 1}</td>
            <td>${d.notas || "—"}</td>
          </tr>`;
        tbody.insertAdjacentHTML("beforeend", fila);
        filas++;
      });
    }

    // --- Donaciones sin campaña ---
    if (tipo === "Donaciones sin campaña") {
      thead.innerHTML = `
        <tr>
          <th>#</th>
          <th>Donante</th>
          <th>Tipo de sangre</th>
          <th>Fecha</th>
          <th>Hospital</th>
          <th>Cantidad</th>
          <th>Notas</th>
        </tr>`;
      donaciones.filter(d => !d.campaña || d.campaña === "").forEach((d, i) => {
        const fila = `
          <tr>
            <td>${i + 1}</td>
            <td>${d.donante}</td>
            <td>${d.tipo}</td>
            <td>${d.fecha}</td>
            <td>${d.hospital || "—"}</td>
            <td>${d.cantidad || 1}</td>
            <td>${d.notas || "—"}</td>
          </tr>`;
        tbody.insertAdjacentHTML("beforeend", fila);
        filas++;
      });
    }

    // --- Donaciones por campaña ---
    if (tipo === "Donaciones por campaña") {
      thead.innerHTML = `
        <tr>
          <th>#</th>
          <th>Campaña</th>
          <th>Total de bolsas</th>
        </tr>`;
      // Agrupar donaciones por campaña
      const agrupadas = {};
      donaciones.filter(d => d.campaña && d.campaña !== "").forEach(d => {
        agrupadas[d.campaña] = (agrupadas[d.campaña] || 0) + (d.cantidad || 1);
      });
      Object.keys(agrupadas).forEach((camp, i) => {
        const fila = `
          <tr>
            <td>${i + 1}</td>
            <td>${camp}</td>
            <td>${agrupadas[camp]} bolsas</td>
          </tr>`;
        tbody.insertAdjacentHTML("beforeend", fila);
        filas++;
      });
    }

    // --- Campañas activas ---
    if (tipo === "Campañas activas") {
      thead.innerHTML = `
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Total de bolsas</th>
        </tr>`;
      campañas.filter(c => c.estado === "Activa").forEach((c, i) => {
        const fila = `
          <tr>
            <td>${i + 1}</td>
            <td>${c.nombre}</td>
            <td>${c.estado}</td>
            <td>${c.bolsas ?? 0} bolsas</td>
          </tr>`;
        tbody.insertAdjacentHTML("beforeend", fila);
        filas++;
      });
    }

    // --- SweetAlert feedback ---
    if (filas === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin resultados',
        text: 'No hay datos para este tipo de reporte.'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Reporte generado',
        text: `Se encontraron ${filas} registros.`
      });
    }
  }

  btnGenerar.addEventListener("click", generarReporte);

  btnPDF.addEventListener("click", () => {
    Swal.fire({
      icon: 'info',
      title: 'Exportar PDF',
      text: 'Aquí iría la lógica para exportar a PDF.'
    });
  });

  btnExcel.addEventListener("click", () => {
    Swal.fire({
      icon: 'info',
      title: 'Exportar Excel',
      text: 'Aquí iría la lógica para exportar a Excel.'
    });
  });
});

