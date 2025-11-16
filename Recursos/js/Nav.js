document.addEventListener('DOMContentLoaded', function () {

  const cssNav = document.createElement("link");
  cssNav.rel = "stylesheet";
  cssNav.href = "../Recursos/css/nav.css";
  document.head.appendChild(cssNav);

  const cssIcons = document.createElement("link");
  cssIcons.rel = "stylesheet";
  cssIcons.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css";
  document.head.appendChild(cssIcons);

  const navHTML = `
  <nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">

      <a class="navbar-brand" href="Menu.html">Banco de Sangre</a>

      <div class="d-flex align-items-center">

        <!-- CAMPANA DE NOTIFICACIONES -->
        <button class="btn btn-link text-dark position-relative me-2" id="btnNoti">
          <i class="bi bi-bell-fill fs-4"></i>
          <span class="badge-noti" id="badgeNoti">3</span>
        </button>

        <!-- MENÚ HAMBURGUESA -->
        <button class="navbar-toggler" type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>

      </div>


      <!-- PANEL DE ALERTAS -->
      <div class="notification-panel" id="notiPanel">
        <h6 class="panel-title">Alertas</h6>
        <ul class="notification-list" id="listaAlertas">
          <li><strong>Bolsa O+ por vencer</strong><p>Quedan 2 días antes del vencimiento</p></li>
          <li><strong>Solicitud urgente</strong><p>Hospital Bloom solicitó 3 unidades</p></li>
          <li><strong>Inventario bajo</strong><p>Nivel crítico en tipo B-</p></li>
        </ul>
      </div>


      <!-- OFFCANVAS -->
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
  if (container) {
    container.innerHTML = navHTML;
  }

  const btnNoti = document.getElementById("btnNoti");
  const notiPanel = document.getElementById("notiPanel");

  btnNoti.addEventListener("click", () => {
    notiPanel.classList.toggle("show");
  });


  document.addEventListener("click", (e) => {
    const clickOutside =
      !btnNoti.contains(e.target) &&
      !notiPanel.contains(e.target);

    if (clickOutside) notiPanel.classList.remove("show");
  });

});
