/**
 * Wrapper para adaptar la API de qrcodejs a la API de qrcode (toCanvas)
 * Esto permite usar la librería local sin necesidad de internet
 */

(function() {
    'use strict';
    
    // Verificar que QRCode (qrcodejs) esté cargado
    if (typeof QRCode === 'undefined') {
        console.error('QRCode (qrcodejs) no está cargado');
        return;
    }
    
    // Guardar la API original
    const QRCodeOriginal = QRCode;
    
    // Crear wrapper con la API compatible
    window.QRCode = {
        toCanvas: function(canvas, text, options, callback) {
            options = options || {};
            
            // Configurar opciones para qrcodejs
            const qrOptions = {
                text: text,
                width: options.width || 300,
                height: options.width || 300, // qrcodejs usa width y height
                colorDark: options.color ? options.color.dark : '#000000',
                colorLight: options.color ? options.color.light : '#FFFFFF',
                correctLevel: QRCodeOriginal.CorrectLevel[options.errorCorrectionLevel || 'M'] || QRCodeOriginal.CorrectLevel.M
            };
            
            return new Promise((resolve, reject) => {
                try {
                    // Crear un contenedor temporal
                    const tempDiv = document.createElement('div');
                    tempDiv.style.position = 'absolute';
                    tempDiv.style.left = '-9999px';
                    tempDiv.style.width = qrOptions.width + 'px';
                    tempDiv.style.height = qrOptions.height + 'px';
                    document.body.appendChild(tempDiv);
                    
                    // Crear instancia de QRCode
                    const qr = new QRCodeOriginal(tempDiv, qrOptions);
                    
                    // Esperar a que se genere
                    setTimeout(() => {
                        try {
                            // Obtener el canvas generado por qrcodejs
                            const qrCanvas = tempDiv.querySelector('canvas');
                            
                            if (qrCanvas) {
                                // Copiar al canvas proporcionado
                                const ctx = canvas.getContext('2d');
                                canvas.width = qrCanvas.width;
                                canvas.height = qrCanvas.height;
                                ctx.drawImage(qrCanvas, 0, 0);
                                
                                // Limpiar
                                document.body.removeChild(tempDiv);
                                
                                if (callback) callback(null);
                                resolve();
                            } else {
                                // Si no hay canvas, qrcodejs generó una imagen
                                const qrImg = tempDiv.querySelector('img');
                                if (qrImg) {
                                    const ctx = canvas.getContext('2d');
                                    canvas.width = qrOptions.width;
                                    canvas.height = qrOptions.height;
                                    
                                    qrImg.onload = function() {
                                        ctx.drawImage(qrImg, 0, 0);
                                        document.body.removeChild(tempDiv);
                                        if (callback) callback(null);
                                        resolve();
                                    };
                                    qrImg.onerror = function() {
                                        document.body.removeChild(tempDiv);
                                        const error = new Error('Error al generar imagen QR');
                                        if (callback) callback(error);
                                        reject(error);
                                    };
                                } else {
                                    document.body.removeChild(tempDiv);
                                    const error = new Error('No se pudo generar el QR');
                                    if (callback) callback(error);
                                    reject(error);
                                }
                            }
                        } catch (error) {
                            document.body.removeChild(tempDiv);
                            if (callback) callback(error);
                            reject(error);
                        }
                    }, 100);
                } catch (error) {
                    if (callback) callback(error);
                    reject(error);
                }
            });
        },
        
        toString: function(text, options, callback) {
            options = options || {};
            
            const qrOptions = {
                text: text,
                width: options.width || 300,
                height: options.width || 300,
                colorDark: options.color ? options.color.dark : '#000000',
                colorLight: options.color ? options.color.light : '#FFFFFF',
                correctLevel: QRCodeOriginal.CorrectLevel[options.errorCorrectionLevel || 'M'] || QRCodeOriginal.CorrectLevel.M
            };
            
            return new Promise((resolve, reject) => {
                try {
                    // Crear contenedor temporal
                    const tempDiv = document.createElement('div');
                    tempDiv.style.position = 'absolute';
                    tempDiv.style.left = '-9999px';
                    document.body.appendChild(tempDiv);
                    
                    // Crear QR
                    const qr = new QRCodeOriginal(tempDiv, qrOptions);
                    
                    setTimeout(() => {
                        try {
                            const canvas = tempDiv.querySelector('canvas');
                            if (canvas) {
                                // Convertir canvas a SVG
                                const width = canvas.width;
                                const height = canvas.height;
                                const ctx = canvas.getContext('2d');
                                const imageData = ctx.getImageData(0, 0, width, height);
                                const data = imageData.data;
                                
                                let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
                                svg += `<rect width="${width}" height="${height}" fill="${qrOptions.colorLight}"/>`;
                                
                                // Convertir píxeles a rectángulos SVG
                                for (let y = 0; y < height; y++) {
                                    for (let x = 0; x < width; x++) {
                                        const idx = (y * width + x) * 4;
                                        if (data[idx] < 128) { // Negro
                                            svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${qrOptions.colorDark}"/>`;
                                        }
                                    }
                                }
                                
                                svg += '</svg>';
                                
                                document.body.removeChild(tempDiv);
                                
                                if (callback) callback(null, svg);
                                resolve(svg);
                            } else {
                                document.body.removeChild(tempDiv);
                                const error = new Error('No se pudo generar SVG');
                                if (callback) callback(error);
                                reject(error);
                            }
                        } catch (error) {
                            document.body.removeChild(tempDiv);
                            if (callback) callback(error);
                            reject(error);
                        }
                    }, 100);
                } catch (error) {
                    if (callback) callback(error);
                    reject(error);
                }
            });
        }
    };
    
    console.log('✅ QRCode wrapper cargado - API adaptada');
})();

