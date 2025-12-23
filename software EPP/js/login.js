function login() {
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        alert("Ingrese usuario y contraseña");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const valido = usuarios.find(
        u => u.usuario === usuario && u.password === password
    );

    if (!valido) {
        alert("Usuario o contraseña incorrectos");
        return;
    }

    localStorage.setItem("usuarioActivo", usuario);
    window.location.href = "home.html";
}
