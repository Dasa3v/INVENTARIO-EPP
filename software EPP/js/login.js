const API = "http://127.0.0.1:8000";

async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  if (!usuario || !password) {
    alert("Complete todos los campos");
    return;
  }

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password })
  });

  const data = await res.json();

  if (!data.ok) {
    alert(data.error || "Credenciales incorrectas");
    return;
  }

  localStorage.setItem("usuario", data.usuario);
  localStorage.setItem("rol", data.rol);

  window.location.href = "home.html";
}
