let campañas = JSON.parse(localStorage.getItem("campañas")) || [];
let editandoIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCampaña");
  const tablaBody = document.getElementById("tablaCampañas");
  const btnGuardar = document.getElementById("btnGuardarCampaña");

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const lugar = document.getElementById("lugar").value.trim();
    const fecha = document.getElementById("fecha").value;
    const estado = document.getElementById("estado").value;
    const bolsas = parseInt(document.getElementById("bolsas").value) || 0;

    if (!nombre || !lugar || !fecha) {
      Swal.fire("Campos incompletos", "Nombre, lugar y fecha son obligatorios", "warning");
      return;
    }

    const nueva = { nombre, lugar, fecha, estado, bolsas };

    if (editandoIndex !== null) {
      campañas[editandoIndex] = nueva;
      Swal.fire("Editado", "La campaña fue actualizada", "success");
      editandoIndex = null;
    } else {
      campañas.push(nueva);
      Swal.fire("Guardado", "Campaña registrada correctamente", "success");
    }

    localStorage.setItem("campañas", JSON.stringify(campañas));
    mostrarCampañas();
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById("modalCampaña")).hide();
  });

  window.editarCampaña = (index) => {
    const c = campañas[index];
    document.getElementById("nombre").value = c.nombre;
    document.getElementById("lugar").value = c.lugar;
    document.getElementById("fecha").value = c.fecha;
    document.getElementById("estado").value = c.estado;
    document.getElementById("bolsas").value = c.bolsas;
    editandoIndex = index;

    new bootstrap.Modal(document.getElementById("modalCampaña")).show();
  };

  window.eliminarCampaña = (index) => {
    Swal.fire({
      title: "¿Eliminar campaña?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c8a5",
      cancelButtonColor: "#d9534f",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        campañas.splice(index, 1);
        localStorage.setItem("campañas", JSON.stringify(campañas));
        mostrarCampañas();
        Swal.fire("Eliminada", "La campaña fue eliminada", "success");
      }
    });
  };

  window.verCampaña = (index) => {
    const c = campañas[index];
    Swal.fire({
      title: c.nombre,
      html: `
        <b>Lugar:</b> ${c.lugar}<br>
        <b>Fecha:</b> ${c.fecha}<br>
        <b>Estado:</b> ${c.estado}<br>
        <b>Bolsas recolectadas:</b> ${c.bolsas}
      `,
      icon: "info"
    });
  };

  function mostrarCampañas() {
    tablaBody.innerHTML = "";
    campañas.forEach((c, i) => {
      const fila = document.createElement("tr");
      const badgeClass = c.estado === "Activa" ? "bg-success" : "bg-danger";

      fila.innerHTML = `
        <td>${c.nombre}</td>
        <td>${c.lugar}</td>
        <td>${c.fecha}</td>
        <td>${c.bolsas}</td>
        <td><span class="badge ${badgeClass}">${c.estado}</span></td>
        <td class="d-flex gap-1">
          <button class="btn btn-secondary btn-sm btn-accion" onclick="verCampaña(${i})">Ver</button>
          <button class="btn btn-aqua btn-sm btn-accion" onclick="editarCampaña(${i})">Editar</button>
          <button class="btn btn-eliminar btn-sm btn-accion" onclick="eliminarCampaña(${i})">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });

    actualizarIndicadores();
  }

  function actualizarIndicadores() {
    const activas = campañas.filter(c => c.estado === "Activa").length;
    document.getElementById("contadorActivas").textContent = activas;

    // Conexión con donaciones
    const donaciones = JSON.parse(localStorage.getItem("donaciones")) || [];
    const bolsasMes = donaciones.length; // cada donación = 1 bolsa
    document.getElementById("contadorBolsas").textContent = bolsasMes;

    // Próxima campaña
    if (campañas.length > 0) {
      const fechas = campañas.map(c => new Date(c.fecha)).sort((a, b) => a - b);
      const proxima = fechas.find(f => f >= new Date());
      document.getElementById("proximaCampaña").textContent = proxima ? proxima.toLocaleDateString() : "—";
    } else {
      document.getElementById("proximaCampaña").textContent = "—";
    }
  }

  mostrarCampañas();
});

actualizarDatos("campañas", campañas);

// Finalizar campaña
campañas[index].estado = "Finalizada";
actualizarDatos("campañas", campañas);

// Editar bolsas
campañas[index].bolsas = nuevasBolsas;
actualizarDatos("campañas", campañas);
