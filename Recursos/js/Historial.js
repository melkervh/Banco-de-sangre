
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('#tabs .nav-link');
    const panes = document.querySelectorAll('.tab-pane');
    const search = document.getElementById('globalSearch');

    function showTab(name) {
        panes.forEach(p => {
            if (p.id === name) {
                p.style.display = '';
                p.classList.add('active');
            } else {
                p.style.display = 'none';
                p.classList.remove('active');
            }
        });

        tabs.forEach(t => {
            t.classList.toggle('active', t.getAttribute('data-tab') === name);
        });
    }

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            showTab(btn.getAttribute('data-tab'));
        });
    });


    showTab("donaciones");

    search.addEventListener("input", () => {
        const q = search.value.toLowerCase().trim();
        const activePane = document.querySelector(".tab-pane.active");

        if (!activePane) return;

        const rows = activePane.querySelectorAll("tbody tr");

        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
        });
    });
});
