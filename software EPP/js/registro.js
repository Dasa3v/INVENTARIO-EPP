function registrar() {
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
        alert("Complete todos los campos");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find(u => u.usuario === usuario);
    if (existe) {
        alert("El usuario ya existe");
        return;
    }

    usuarios.push({ usuario, password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cuenta creada correctamente");
    window.location.href = "index.html";
}
