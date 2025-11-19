document.addEventListener('DOMContentLoaded', function () {
  // --- Validar sesión ---
  const usuario = JSON.parse(localStorage.getItem("usuarioLogeado"));
  if (!usuario) {
    Swal.fire("Acceso denegado", "Debes iniciar sesión primero", "warning").then(() => {
      window.location.href = "Index.html";
    });
    return; // detener ejecución si no hay sesión
  }

  // --- Cargar estilos ---
  const cssNav = document.createElement("link");
  cssNav.rel = "stylesheet";
  cssNav.href = "../Recursos/css/nav.css";
  document.head.appendChild(cssNav);

  const cssIcons = document.createElement("link");
  cssIcons.rel = "stylesheet";
  cssIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css";
  document.head.appendChild(cssIcons);

  // --- HTML del navbar ---
  const navHTML = `
  <nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="Menu.html">Banco de Sangre</a>
      <div class="d-flex align-items-center">
        <button class="btn btn-link text-dark position-relative me-2" id="btnNoti">
          <i class="bi bi-bell-fill fs-4"></i>
          <span class="badge-noti" id="badgeNoti">0</span>
        </button>
        <button class="btn btn-link text-dark ms-2" id="btnLogout">
          <i class="bi bi-box-arrow-right"></i> Salir
        </button>
        <button class="navbar-toggler" type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="notification-panel" id="notiPanel">
        <h6 class="panel-title">Alertas</h6>
        <ul class="notification-list" id="listaAlertas"></ul>
      </div>

      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Panel lateral</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item"><a class="nav-link" href="Menu.html">Menu</a></li>
            <li class="nav-item"><a class="nav-link" href="Donaciones.html">Donaciones</a></li>
            <li class="nav-item"><a class="nav-link" href="Solicitudes.html">Solicitudes</a></li>
            <li class="nav-item"><a class="nav-link" href="Campaña.html">Campañas</a></li>
            <li class="nav-item"><a class="nav-link" href="Reportes.html">Reportes</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  `;

  const container = document.getElementById('navbar-container');
  if (container) container.innerHTML = navHTML;

  const btnNoti = document.getElementById("btnNoti");
  const notiPanel = document.getElementById("notiPanel");
  const listaAlertas = document.getElementById("listaAlertas");
  const badgeNoti = document.getElementById("badgeNoti");
  const btnLogout = document.getElementById("btnLogout");

  // --- Botón cerrar sesión ---
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      Swal.fire({
        title: "¿Cerrar sesión?",
        text: "Se cerrará tu sesión actual",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00c8a5",
        cancelButtonColor: "#d9534f",
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("usuarioLogeado");
          Swal.fire("Sesión cerrada", "Has salido del sistema", "success").then(() => {
            window.location.href = "Index.html";
          });
        }
      });
    });
  }

  // --- Mostrar/ocultar panel ---
  btnNoti.addEventListener("click", () => {
    notiPanel.classList.toggle("show");

    if (notiPanel.classList.contains("show")) {
      badgeNoti.textContent = "0";
      const vistas = Array.from(listaAlertas.querySelectorAll("li"))
        .map(li => li.dataset.id);
      localStorage.setItem("alertasVistas", JSON.stringify(vistas));
    }
  });

  document.addEventListener("click", (e) => {
    const clickOutside = !btnNoti.contains(e.target) && !notiPanel.contains(e.target);
    if (clickOutside) notiPanel.classList.remove("show");
  });

  // --- Función para generar alertas dinámicas ---
  function generarAlertas() {
    const donaciones = JSON.parse(localStorage.getItem("donaciones")) || [];
    const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
    const campañas = JSON.parse(localStorage.getItem("campañas")) || [];

    const alertasVistas = JSON.parse(localStorage.getItem("alertasVistas")) || [];
    let alertas = [];

    if (donaciones.length < 5) {
      alertas.push({
        id: "inv-general",
        titulo: "Inventario bajo",
        detalle: `Solo hay ${donaciones.length} bolsas disponibles en total`
      });
    }

    const sinCampaña = donaciones.filter(d => !d.campaña || d.campaña === "");
    if (sinCampaña.length > 0) {
      alertas.push({
        id: "donaciones-sin-campaña",
        titulo: "Donaciones sin campaña",
        detalle: `Hay ${sinCampaña.length} donaciones sin campaña asignada`
      });
    }

    solicitudes.forEach((s, i) => {
      if (s.urgencia === "Alta") {
        alertas.push({
          id: `solicitud-urgente-${i}`,
          titulo: `Solicitud urgente (${s.estado})`,
          detalle: `${s.hospital} solicitó ${s.unidades} unidades (${s.tipo})`
        });
      }
    });

    solicitudes.filter(s => s.estado === "Rechazada")
      .forEach((s, i) => {
        alertas.push({
          id: `solicitud-rechazada-${i}`,
          titulo: "Solicitud rechazada",
          detalle: `${s.paciente} - ${s.tipo} fue rechazada`
        });
      });

    campañas.filter(c => c.estado === "Activa" && c.bolsas === 0)
      .forEach((c, i) => {
        alertas.push({
          id: `campaña-sin-bolsas-${i}`,
          titulo: "Campaña sin bolsas",
          detalle: `${c.nombre} aún no tiene donaciones registradas`
        });
      });

    campañas.filter(c => c.estado === "Finalizada")
      .forEach((c, i) => {
        alertas.push({
          id: `campaña-finalizada-${i}`,
          titulo: "Campaña finalizada",
          detalle: `${c.nombre} fue cerrada recientemente`
        });
      });

    listaAlertas.innerHTML = "";
    let nuevas = 0;

    alertas.forEach(a => {
      if (alertasVistas.includes(a.id)) return;
      const li = document.createElement("li");
      li.dataset.id = a.id;
      li.innerHTML = `<strong>${a.titulo}</strong><p>${a.detalle}</p>`;
      listaAlertas.appendChild(li);
      nuevas++;
    });

    if (!notiPanel.classList.contains("show")) {
      badgeNoti.textContent = nuevas;
    }
  }

  generarAlertas();
  window.addEventListener("storage", generarAlertas);
  document.addEventListener("datosActualizados", generarAlertas);
  window.generarAlertas = generarAlertas;
});
