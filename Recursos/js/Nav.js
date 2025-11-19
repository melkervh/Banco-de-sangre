document.addEventListener('DOMContentLoaded', function () {
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

  // --- Mostrar/ocultar panel ---
  btnNoti.addEventListener("click", () => {
    notiPanel.classList.toggle("show");

    if (notiPanel.classList.contains("show")) {
      // Reiniciar contador al abrir
      badgeNoti.textContent = "0";

      // Guardar IDs de alertas vistas
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

    // Inventario general bajo
    if (donaciones.length < 5) {
      alertas.push({
        id: "inv-general",
        titulo: "Inventario bajo",
        detalle: `Solo hay ${donaciones.length} bolsas disponibles en total`
      });
    }

    // Inventario crítico en O-
    const bolsasOM = donaciones.filter(d => d.tipo === "O-").length;
    if (bolsasOM < 3) {
      alertas.push({
        id: "inv-critico-o-",
        titulo: "Inventario crítico O-",
        detalle: `Solo hay ${bolsasOM} bolsas de tipo O-`
      });
    }

    // Donaciones sin campaña asignada
    const sinCampaña = donaciones.filter(d => !d.campaña || d.campaña === "");
    if (sinCampaña.length > 0) {
      alertas.push({
        id: "donaciones-sin-campaña",
        titulo: "Donaciones sin campaña",
        detalle: `Hay ${sinCampaña.length} donaciones sin campaña asignada`
      });
    }

    // Solicitudes urgentes
    solicitudes.forEach((s, i) => {
      if (s.urgencia === "Alta") {
        alertas.push({
          id: `solicitud-urgente-${i}`,
          titulo: `Solicitud urgente (${s.estado})`,
          detalle: `${s.hospital} solicitó ${s.unidades} unidades (${s.tipo})`
        });
      }
    });

    // Solicitudes rechazadas
    solicitudes.filter(s => s.estado === "Rechazada")
      .forEach((s, i) => {
        alertas.push({
          id: `solicitud-rechazada-${i}`,
          titulo: "Solicitud rechazada",
          detalle: `${s.paciente} - ${s.tipo} fue rechazada`
        });
      });

    // Campañas activas sin bolsas
    campañas.filter(c => c.estado === "Activa" && c.bolsas === 0)
      .forEach((c, i) => {
        alertas.push({
          id: `campaña-sin-bolsas-${i}`,
          titulo: "Campaña sin bolsas",
          detalle: `${c.nombre} aún no tiene donaciones registradas`
        });
      });

    // Campañas finalizadas
    campañas.filter(c => c.estado === "Finalizada")
      .forEach((c, i) => {
        alertas.push({
          id: `campaña-finalizada-${i}`,
          titulo: "Campaña finalizada",
          detalle: `${c.nombre} fue cerrada recientemente`
        });
      });

    // Renderizar alertas
    listaAlertas.innerHTML = "";
    let nuevas = 0;

    alertas.forEach(a => {
      // Si ya fue vista, no la mostramos
      if (alertasVistas.includes(a.id)) return;

      const li = document.createElement("li");
      li.dataset.id = a.id;
      li.innerHTML = `<strong>${a.titulo}</strong><p>${a.detalle}</p>`;
      listaAlertas.appendChild(li);

      nuevas++;
    });

    // Actualizar badge solo si el panel está cerrado
    if (!notiPanel.classList.contains("show")) {
      badgeNoti.textContent = nuevas;
    }
  }

  // --- Generar alertas al cargar ---
  generarAlertas();

  // --- Escuchar cambios en otras pestañas ---
  window.addEventListener("storage", generarAlertas);

  // --- Escuchar cambios en el mismo tab ---
  document.addEventListener("datosActualizados", generarAlertas);

  // --- Exponer función global ---
  window.generarAlertas = generarAlertas;
});

