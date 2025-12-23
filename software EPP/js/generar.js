// frontend/js/generar.js
// Generador de QR - 1 QR = 1 combinación (humano-legible)
// Requiere: generar.html con selects: area, producto, subtipo, genero, talla, color, marca
// y un contenedor #preview donde mostrar el QR.

const API = "http://127.0.0.1:8000";

// Mapas para abreviaciones (para el código legible)
const mapProducto = {
    "Camisa": "CAM",
    "Pantalón": "PAN",
    "Guantes": "GUA",
    "Botas": "BOT",
    "Casco": "CAS",
    "Chaleco Reflectivo": "CHR",
    "Gafas estándar": "GAF",
    "Gafas Top Gun": "GTG",
    "Gafas Sobreponer": "GSP"
};

const mapColor = {
    "Azul Claro": "AC",
    "Azul Oscuro": "AO",
    "Blanco": "BL",
    "Negro": "NG",
    "Café": "CF",
    "Amarillo": "AM",
    "Amarillo Reflectivo": "AR",
    "Transparente": "TR",
    "Humo": "HM"
};

const mapMarca = {
    "Genérico": "GEN",
    "DOT": "DOT",
    "Segury": "SEG",
    "3M": "3M"
};

// Normaliza texto para la etiqueta final (quita espacios y mayúsculas si corresponde)
function normalizarEtiqueta(s) {
    if (!s) return "";
    return String(s).replace(/\s+/g, '').toUpperCase();
}

// Construye el código humano-legible (opción A)
function construirCodigo(area, producto, subtipo, genero, talla, color, marca) {
    // producto -> abreviatura
    const p = mapProducto[producto] || normalizarEtiqueta(producto).slice(0,3);
    const g = genero ? genero.toUpperCase() : "—"; // H / M / —
    const st = subtipo ? normalizarEtiqueta(subtipo).slice(0,3) : "—";
    const c = mapColor[color] || normalizarEtiqueta(color).slice(0,3);
    const m = mapMarca[marca] || normalizarEtiqueta(marca).slice(0,3);

    // ejemplo: OPR-CAM-BUS-H-XL-AO-SEG  (sin consecutivo)
    return `${area}-${p}-${st}-${g}-${talla}-${c}-${m}`;
}

// Genera y muestra el QR; registra en backend si no existe
async function generarQRyRegistrar() {
    const area = document.getElementById("area").value;
    const producto = document.getElementById("producto").value;
    const subtipo = document.getElementById("subtipo") ? document.getElementById("subtipo").value : "";
    const genero = document.getElementById("genero") ? document.getElementById("genero").value : "";
    const talla = document.getElementById("talla").value;
    const color = document.getElementById("color").value;
    const marca = document.getElementById("marca").value;

    if (!area || !producto || !talla || !color || !marca) {
        return alert("Completa: Área, Producto, Talla, Color y Marca.");
    }

    const codigo = construirCodigo(area, producto, subtipo, genero, talla, color, marca);

    // 1) Verificar si ya existe
    try {
        const respCheck = await fetch(`${API}/producto/${encodeURIComponent(codigo)}`);
        if (respCheck.status === 200) {
            // Ya existe: prevenir duplicados. Mostrar datos y preguntar si quiere actualizar.
            const existente = await respCheck.json();
            const msg = `El QR ya existe en la base de datos:\n\nQR: ${existente.qr}\nProducto: ${existente.producto}\nSubtipo: ${existente.subtipo}\nGénero: ${existente.genero}\nTalla: ${existente.talla}\nColor: ${existente.color}\nMarca: ${existente.marca}\nÁrea: ${existente.area}\n\n¿Deseas abrir la ficha para editarla? (OK -> abrir ficha)`;
            if (confirm(msg)) {
                // abrir página de edición / productos.html y pasar qr como query
                window.location.href = `productos.html?qr=${encodeURIComponent(existente.qr)}`;
            }
            return;
        }
    } catch (e) {
        // Si responde 404 seguirá, otras fallas se reportan
        if (e) {
            // noop
        }
    }

    // 2) Registrar en backend
    const payload = {
        qr: codigo,
        producto: producto,
        subtipo: subtipo || "",
        genero: genero || "",
        categoria: producto, // si quieres otra lógica de categoría, el backend hará la asignación automática
        talla: talla,
        color: color,
        marca: marca,
        area: area
    };

    try {
        const res = await fetch(`${API}/registrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!json.ok) {
            alert("Error registrando en backend: " + (json.msg || JSON.stringify(json)));
            return;
        }
    } catch (err) {
        alert("Error en la conexión con el backend: " + err);
        return;
    }

    // 3) Mostrar QR en preview
    mostrarPreview(codigo);

    // 4) Guardar QR actual en localStorage (opcional)
    localStorage.setItem("ultimo_qr_generado", codigo);

    alert("QR generado y registrado correctamente: " + codigo);
}

// Muestra el QR en #preview
function mostrarPreview(codigo) {
    const preview = document.getElementById("preview");
    preview.innerHTML = "";

    const cont = document.createElement("div");
    cont.className = "qr-item";

    const canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas, codigo, { width: 200 }, function (err) {
        if (err) console.error(err);
    });

    const label = document.createElement("p");
    label.textContent = codigo;

    cont.appendChild(canvas);
    cont.appendChild(label);
    preview.appendChild(cont);
}

// Conectar el botón del HTML (si tu HTML llama a generarQRs(), lo dejamos)
function generarQRs() {
    generarQRyRegistrar();
}

// Exportar para consola (opcional)
window.generarQRs = generarQRs;
