document.addEventListener("DOMContentLoaded", () => {
  const donaciones = JSON.parse(localStorage.getItem("donaciones")) || [];
  const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
  const campañas = JSON.parse(localStorage.getItem("campañas")) || [];

  // --- Tarjetas dinámicas ---
  document.getElementById("totalDonaciones").textContent = donaciones.length;

  const activas = campañas.filter(c => c.estado === "Activa").length;
  document.getElementById("campañasActivas").textContent = activas;

  const aprobadas = solicitudes.filter(s => s.estado === "Aprobada").length;
  document.getElementById("solAprobadas").textContent = aprobadas;

  // Inventario general = total de bolsas registradas en donaciones
  const inventarioGeneral = donaciones.length;
  document.getElementById("inventarioGeneral").textContent = inventarioGeneral;

  // --- Gráfico de tipos de sangre ---
  const tipos = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const conteoTipos = tipos.map(t => donaciones.filter(d => d.tipo === t).length);

  const sangreCanvas = document.getElementById("graficoSangre");
  new Chart(sangreCanvas, {
    type: "bar",
    data: {
      labels: tipos,
      datasets: [{
        label: "Unidades",
        data: conteoTipos,
        backgroundColor: "rgba(0, 200, 165, 0.7)",
        borderRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#0a1a2f" } },
        y: { ticks: { color: "#3b4a60" } }
      }
    }
  });

  // --- Gráfico de donaciones por mes ---
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const conteoMeses = new Array(12).fill(0);

  donaciones.forEach(d => {
    const mes = new Date(d.fecha).getMonth();
    conteoMeses[mes]++;
  });

  const donCanvas = document.getElementById("graficoDonaciones");
  const ctx = donCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, "rgba(0, 200, 165, 0.45)");
  gradient.addColorStop(1, "rgba(0, 200, 165, 0)");

  new Chart(donCanvas, {
    type: "line",
    data: {
      labels: meses,
      datasets: [{
        label: "Donaciones",
        data: conteoMeses,
        borderColor: "#00c8a5",
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: "#00c8a5",
        pointBorderColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#0a1a2f" } },
        y: { ticks: { color: "#3b4a60" } }
      }
    }
  });

  // --- Actualizar notificaciones del navbar ---
  if (window.generarAlertas) window.generarAlertas();
  document.dispatchEvent(new Event("datosActualizados"));
});
