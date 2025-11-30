

tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        primary: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                        }
                    }
                }
            }
        }
        // --- Dark Mode Logic ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

        // Check local storage or system preference on load
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            themeToggleLightIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            themeToggleDarkIcon.classList.remove('hidden');
        }

        themeToggleBtn.addEventListener('click', function() {
            // Toggle icons
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            // If is set in local storage
            if (localStorage.getItem('color-theme')) {
                if (localStorage.getItem('color-theme') === 'light') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                }
            } else {
                // If not in local storage
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                }
            }
        });


        // --- QR Code Logic ---
        const qrDataInput = document.getElementById('qr-data');
        const generateBtn = document.getElementById('generate-btn');
        const downloadBtn = document.getElementById('download-btn');
        const qrCodeContainer = document.getElementById('qrcode');
        const statusMessage = document.getElementById('status-message');

        let qr; // To hold the QRCode instance

        /**
         * Initializes the QR code generator.
         * Waits for the library to load before enabling the UI.
         */
        function initializeQrCode() {
            // Check if QRCode is defined.
            // If it's not defined, wait 100ms and try again.
            if (typeof QRCode === 'undefined') {
                console.log("QRCode library not yet loaded. Retrying in 100ms...");
                setTimeout(initializeQrCode, 100);
                return;
            }

            console.log("QRCode library loaded successfully.");

            // Enable the Generate button now that the library is ready
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            
            // Clear loading text
            qrCodeContainer.innerHTML = '';

            // Initialize QRCode with default data
            try {
                qr = new QRCode(qrCodeContainer, {
                    text: qrDataInput.value || "https://example.com",
                    width: 256,
                    height: 256,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                enableDownload(true);
            } catch (e) {
                console.error("Initialization error:", e);
            }
        }

        /**
         * Generates and displays the QR code based on the input data.
         */
        function generateQrCode() {
            if (typeof QRCode === 'undefined') return;
            
            const data = qrDataInput.value.trim();

            if (!data) {
                // Show error message
                statusMessage.classList.remove('hidden');
                enableDownload(false);
                // Don't clear container, just leave previous or show empty state if preferred
                return;
            }

            // Hide error message
            statusMessage.classList.add('hidden');

            // 1. Clear the container first
            qrCodeContainer.innerHTML = '';
            
            // 2. Re-create the QRCode instance
            try {
                qr = new QRCode(qrCodeContainer, {
                    text: data,
                    width: 256,
                    height: 256,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
                enableDownload(true);
            } catch (e) {
                console.error("Error generating QR code:", e);
                qrCodeContainer.innerHTML = '<p class="text-red-500">Error generating QR Code</p>';
            }
        }

        /**
         * Toggles the download button state.
         * @param {boolean} enable - Whether to enable or disable the button.
         */
        function enableDownload(enable) {
            if (enable) {
                downloadBtn.disabled = false;
                downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                downloadBtn.disabled = true;
                downloadBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        /**
         * Handles the download functionality.
         */
        function downloadQrCode() {
            const canvas = qrCodeContainer.querySelector('canvas');
            const img = qrCodeContainer.querySelector('img');
            
            let dataURL = null;

            if (canvas) {
                dataURL = canvas.toDataURL("image/png");
            } else if (img && img.src && img.src.startsWith('data:')) {
                // Fallback if the library renders an IMG tag instead of Canvas
                dataURL = img.src;
            }

            if (dataURL) {
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = `qrcode_${Date.now()}.png`; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('QR Code source not found. Please click "Generate" first.');
            }
        }

        // --- Event Listeners ---

        // Initial generation when the page loads
        window.onload = initializeQrCode;

        // Button Click to Generate
        generateBtn.addEventListener('click', generateQrCode);

        // Allow pressing Enter in the textarea to generate (but prevent form submission)
        qrDataInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!generateBtn.disabled) {
                    generateQrCode();
                }
            }
        });

        
        downloadBtn.addEventListener('click', downloadQrCode);

    