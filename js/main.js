// Seleccionar elementos del DOM
const scanButton = document.getElementById('scan-button');
const qrReader = document.getElementById('qr-reader');
const redirectModal = document.getElementById('redirect-modal');
const confirmRedirect = document.getElementById('confirm-redirect');
const cancelRedirect = document.getElementById('cancel-redirect');

// Verificar si los elementos existen
if (!scanButton || !qrReader || !redirectModal || !confirmRedirect || !cancelRedirect) {
    console.error('Error: Uno o más elementos del DOM no se encontraron.');
    alert('Error en la carga de la aplicación. Revisa la consola para más detalles.');
    return;
}

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
    console.log('Código QR escaneado:', decodedText);
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
    }).catch(err => {
        console.error('Error al detener el escáner:', err);
        toggleSections(false);
    });
}

// Evento para iniciar el escaneo
scanButton.addEventListener('click', () => {
    console.log('Botón de escanear clicado');
    toggleSections(true);
    html5QrCode.start(
        { facingMode: 'environment' }, // Usar cámara trasera
        { fps: 10, qrbox: { width: 250, height: 250 } }, // Configuración
        onScanSuccess,
        (errorMessage) => console.warn('Error en escaneo:', errorMessage)
    ).then(() => {
        console.log('Escáner iniciado correctamente');
    }).catch(err => {
        console.error('Error al iniciar el escáner:', err);
        alert('No se pudo iniciar el escáner. Revisa la consola para más detalles.');
        toggleSections(false);
    });
});

// Evento para confirmar redirección
confirmRedirect.addEventListener('click', () => {
    if (scannedUrl) {
        window.open(scannedUrl, '_blank'); // Abrir URL en nueva pestaña
    }
    scannedUrl = ''; // Limpiar URL
    toggleSections(false); // Ocultar modal y volver al estado inicial
});

// Evento para cancelar redirección
cancelRedirect.addEventListener('click', () => {
    scannedUrl = ''; // Limpiar URL
    toggleSections(false); // Ocultar modal y volver al estado inicial
});
