const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
document.addEventListener("DOMContentLoaded", () => {
  const formRegistro = document.getElementById("formRegistro");
  const formLogin = document.getElementById("formLogin");

  // --- Registro ---
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreRegistro").value.trim();
    const correo = document.getElementById("correoRegistro").value.trim();
    const pass = document.getElementById("passRegistro").value.trim();

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Validar si ya existe
    if (usuarios.some(u => u.correo === correo)) {
      Swal.fire("Error", "Ya existe un usuario con ese correo", "error");
      return;
    }

    usuarios.push({ nombre, correo, pass });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    Swal.fire("Registrado", "Cuenta creada correctamente", "success");
    formRegistro.reset();
  });

  // --- Login ---
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.getElementById("correoLogin").value.trim();
    const pass = document.getElementById("passLogin").value.trim();

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.correo === correo && u.pass === pass);

    if (!usuario) {
      Swal.fire("Error", "Correo o contraseña incorrectos", "error");
      return;
    }

    // Guardar sesión activa
    localStorage.setItem("usuarioLogeado", JSON.stringify(usuario));
    Swal.fire("Bienvenido", `Hola ${usuario.nombre}`, "success").then(() => {
      window.location.href = "Menu.html";
    });
  });
});
