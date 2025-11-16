

const sangreCanvas = document.getElementById("graficoSangre");

new Chart(sangreCanvas, {
    type: "bar",
    data: {
        labels: ["O+", "O-", "A+", "A-"],
        datasets: [{
            label: "Unidades",
            data: [80, 20, 60, 15],
            backgroundColor: [
                "rgba(0, 200, 165, 0.85)",
                "rgba(0, 200, 165, 0.70)",
                "rgba(0, 200, 165, 0.55)",
                "rgba(0, 200, 165, 0.40)"
            ],
            borderRadius: 12,
            borderSkipped: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                ticks: { color: "#0a1a2f" },
                grid: { display: false }
            },
            y: {
                ticks: { color: "#3b4a60" },
                grid: { color: "rgba(0,0,0,0.05)" }
            }
        }
    }
});


const donCanvas = document.getElementById("graficoDonaciones");
const ctx = donCanvas.getContext("2d");

const gradient = ctx.createLinearGradient(0, 0, 0, 200);
gradient.addColorStop(0, "rgba(0, 200, 165, 0.45)");
gradient.addColorStop(1, "rgba(0, 200, 165, 0)");

new Chart(donCanvas, {
    type: "line",
    data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [{
            label: "Donaciones",
            data: [30, 45, 50, 40, 70, 60],
            borderColor: "#00c8a5",
            backgroundColor: gradient,
            fill: true,
            tension: 0.45,
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: "#00c8a5",
            pointBorderColor: "#ffffff",
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                ticks: { color: "#0a1a2f" },
                grid: { display: false }
            },
            y: {
                ticks: { color: "#3b4a60" },
                grid: { color: "rgba(0,0,0,0.05)" }
            }
        }
    }
});
