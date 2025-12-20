let scanner = null;

document.getElementById("start-scan").addEventListener("click", () => {
    if (scanner !== null) return;

    scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        qrCodeMessage => {

            // Mostrar el QR en el input
            document.getElementById("qr-value").value = qrCodeMessage;

            // --- NUEVO: Guardar automáticamente en el backend ---
            fetch(`http://127.0.0.1:8000/detectar/${qrCodeMessage}`, {
                method: "POST"
            })
            .then(res => res.json())
            .then(data => {
                console.log("QR guardado automáticamente:", data);
            })
            .catch(err => console.error("Error guardando QR:", err));
        }
    );
});

document.getElementById("stop-scan").addEventListener("click", () => {
    if (scanner) {
        scanner.stop();
        scanner.clear();
        scanner = null;
    }
});
