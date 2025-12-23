const API = "http://127.0.0.1:8000";

async function recuperar() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (!usuario || !password) {
        alert("Complete los campos");
        return;
    }

    const res = await fetch(`${API}/recuperar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password })
    });

    const data = await res.json();

    if (!data.ok) {
        alert(data.error || "Error");
        return;
    }

    alert("Contraseña actualizada");
    window.location.href = "index.html";
}
