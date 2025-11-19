let donaciones = JSON.parse(localStorage.getItem("donaciones")) || [];
let campañas = JSON.parse(localStorage.getItem("campañas")) || [];
let editandoIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDonacion");
  const tablaBody = document.querySelector("tbody");
  const campañaSelect = document.getElementById("campaña");

  // Cargar campañas en el select
  function cargarCampañas() {
    campañaSelect.innerHTML = '<option value="">— Sin campaña —</option>';
    campañas.forEach(c => {
      const option = document.createElement("option");
      option.value = c.nombre;
      option.textContent = c.nombre;
      campañaSelect.appendChild(option);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const donante = document.getElementById("donante").value.trim();
    const tipo = document.getElementById("tipo").value;
    const fecha = document.getElementById("fecha").value;
    const notas = document.getElementById("notas").value.trim();
    const campaña = campañaSelect.value;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!donante || !fecha || !cantidad || cantidad <= 0) {
      Swal.fire("Campos incompletos", "Nombre, fecha y cantidad son obligatorios", "warning");
      return;
    }

    const nueva = { donante, tipo, fecha, notas, campaña, cantidad };

    if (editandoIndex !== null) {
      donaciones[editandoIndex] = nueva;
      Swal.fire("Editado", "La donación fue actualizada", "success");
      editandoIndex = null;
    } else {
      donaciones.push(nueva);
      Swal.fire("Guardado", "Donación registrada correctamente", "success");
    }

    localStorage.setItem("donaciones", JSON.stringify(donaciones));
    form.reset();
    mostrarDonaciones();
  });

  window.editarDonacion = (index) => {
    const d = donaciones[index];
    document.getElementById("donante").value = d.donante;
    document.getElementById("tipo").value = d.tipo;
    document.getElementById("fecha").value = d.fecha;
    document.getElementById("notas").value = d.notas;
    document.getElementById("campaña").value = d.campaña || "";
    document.getElementById("cantidad").value = d.cantidad || 1;
    editandoIndex = index;

    const collapse = new bootstrap.Collapse(document.getElementById("formDonacionWrap"), { toggle: true });
    collapse.show();
  };

  window.eliminarDonacion = (index) => {
    Swal.fire({
      title: "¿Eliminar donación?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c8a5",
      cancelButtonColor: "#d9534f",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        donaciones.splice(index, 1);
        localStorage.setItem("donaciones", JSON.stringify(donaciones));
        mostrarDonaciones();
        Swal.fire("Eliminado", "La donación fue eliminada", "success");
      }
    });
  };

  function mostrarDonaciones() {
    tablaBody.innerHTML = "";
    donaciones.forEach((d, i) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${i + 1}</td>
        <td>${d.donante}</td>
        <td>${d.tipo}</td>
        <td>${d.fecha}</td>
        <td>${d.campaña || "—"}</td>
        <td>${d.cantidad || 1}</td>
        <td>${d.notas || "—"}</td>
        <td>
          <button class="btn btn-sm btn-aqua" onclick="editarDonacion(${i})">Editar</button>
          <button class="btn btn-sm btn-eliminar" onclick="eliminarDonacion(${i})">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }

  cargarCampañas();
  mostrarDonaciones();
});
