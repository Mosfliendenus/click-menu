// Seleccionar elementos del DOM
const scanButton = document.getElementById('scan-button');
const qrReader = document.getElementById('qr-reader');
const redirectModal = document.getElementById('redirect-modal');
const confirmRedirect = document.getElementById('confirm-redirect');
const cancelRedirect = document.getElementById('cancel-redirect');

// Inicializar el escáner de QR
const html5QrCode = new Html5Qrcode('qr-reader');
let scannedUrl = ''; // Variable para almacenar la URL escaneada

// Función para mostrar u ocultar secciones
function toggleSections(showScanner, showModal = false) {
    qrReader.classList.toggle('hidden', !showScanner);
    scanButton.classList.toggle('hidden', showScanner || showModal);
    redirectModal.classList.toggle('hidden', !showModal);
}

// Función para manejar el resultado del escaneo
function onScanSuccess(decodedText, decodedResult) {
    // Detener el escáner
    html5QrCode.stop().then(() => {
        // Validar si es una URL válida
        try {
            new URL(decodedText);
            scannedUrl = decodedText; // Guardar la URL
            toggleSections(false, true); // Mostrar el modal
        } catch (e) {
            alert('El código QR no contiene una URL válida.');
            toggleSections(false);
        }
    }).catch(err => console.error('Error al detener el escáner:', err));
}

// Evento para iniciar el escaneo
scanButton.addEventListener('click', () => {
    toggleSections(true);
    html5QrCode.start(
        { facingMode: 'environment' }, // Usar cámara trasera
        { fps: 10, qrbox: { width: 250, height: 250 } }, // Configuración
        onScanSuccess,
        (errorMessage) => console.warn('Error en escaneo:', errorMessage)
    ).catch(err => {
        console.error('Error al iniciar el escáner:', err);
        toggleSections(false);
    });
});

// Evento para confirmar redirección
confirmRedirect.addEventListener('click', () => {
    if (scannedUrl) {
        window.open(scannedUrl, '_blank'); // Abrir URL en nueva pestaña
    }
    toggleSections(false); // Ocultar modal y volver al estado inicial
});

// Evento para cancelar redirección
cancelRedirect.addEventListener('click', () => {
    scannedUrl = ''; // Limpiar URL
    toggleSections(false); // Ocultar modal y volver al estado inicial
});
