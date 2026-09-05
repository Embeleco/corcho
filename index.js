                // Tamaño del lienzo del corcho
        const ANCHO_CORCHO = 5000;
        const ALTO_CORCHO = 5000;

        // 1. Centrar la pantalla al cargar la página por primera vez
        window.onload = function() {
            const centroX = (ANCHO_CORCHO - window.innerWidth) / 2;
            const centroY = (ALTO_CORCHO - window.innerHeight) / 2;
            window.scrollTo(centroX, centroY);
        };

// Busca tu evento del botón de centrar y cámbialo por este:
document.getElementById('btn-centro').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que el corcho intercepte el clic

    console.log("¡Botón pulsado correctamente!"); // Si miras la consola (F12), verás si el clic funciona

    // Calculamos el centro exacto restando la mitad de la pantalla del usuario
    const destinoX = 2500 - (window.innerWidth / 2);
    const destinoY = 2500 - (window.innerHeight / 2);
    
    // Forzamos el scroll al centro
    window.scrollTo({
        left: destinoX,
        top: destinoY,
        behavior: 'smooth' // Animación suave
    });
});


        // 3. Sistema Pro de Arrastre con el Ratón (Fluido y sin trabarse)
        let isDown = false;
        let startX, startY;
        let scrollLeft, scrollTop;

        // Escuchamos el clic en toda la ventana de la página
        window.addEventListener('mousedown', (e) => {
    // EXCEPCIÓN CORREGIDA: Si hace clic en un Post-it O en CUALQUIER botón flotante, NO arrastramos
            if (e.target.closest('.post-it') || e.target.closest('.boton-flotante')) return; 
    
        isDown = true;
        document.body.style.cursor = 'grabbing';
    
            startX = e.clientX;
            startY = e.clientY;
            scrollLeft = window.scrollX;
            scrollTop = window.scrollY;
        });


        // Evento cuando el ratón se mueve
        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            
            e.preventDefault(); // Evita selecciones extrañas del navegador
            
            // Calculamos la distancia movida desde el clic inicial
            const distanciaX = e.clientX - startX;
            const distanciaY = e.clientY - startY;
            
            // Ajusta el multiplicador (1.5) si quieres que se mueva más rápido o lento
            window.scrollTo(scrollLeft - distanciaX * 1.5, scrollTop - distanciaY * 1.5);
        });

        // Detenemos el arrastre cuando se suelta el clic del ratón
        window.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                document.body.style.cursor = 'default';
            }
        });

        // Seguridad: Si el ratón se sale de la ventana del navegador, dejamos de arrastrar
        window.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                document.body.style.cursor = 'default';
            }
        });
                // 4. Sistema para Añadir Notas en espacios libres
        const btnCrear = document.getElementById('btn-crear');
        const lienzo = document.getElementById('corcho');
        let modoCreacionActivo = false;

        // Al pulsar el botón del lápiz, activamos/desactivamos el modo creación
        btnCrear.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita interferencias con el arrastre
            modoCreacionActivo = !modoCreacionActivo;

            if (modoCreacionActivo) {
                document.body.classList.add('modo-colocar');
                btnCrear.style.backgroundColor = '#ffcccc'; // Cambia a color rojizo para avisar que está activo
            } else {
                document.body.classList.remove('modo-colocar');
                btnCrear.style.backgroundColor = '#ffffff';
            }
        });

        // Detectamos el clic en el lienzo para clavar la nota
        lienzo.addEventListener('click', (e) => {
            // Si el modo creación no está activo, o si hacemos clic en un post-it existente, no hacemos nada
            if (!modoCreacionActivo || e.target.closest('.post-it')) return;

            // Calculamos la posición EXACTA dentro del corcho de 5000x5000 teniendo en cuenta el scroll actual
            const rect = lienzo.getBoundingClientRect();
            const posX = e.clientX - rect.left;
            const posY = e.clientY - rect.top;

            // Pedimos los datos al usuario (Ventanas nativas del navegador, rápido y sin código extra)
            const textoNota = prompt("¿Qué quieres escribir en tu nota del Campus?");
            if (!textoNota || textoNota.trim() === "") {
                // Si cancela o no escribe nada, desactivamos el modo y salimos
                desactivarModoCreacion();
                return;
            }

            const autorNota = prompt("Tu usuario de Instagram o apodo (opcional):") || "Anónimo";

            // Creamos la estructura del nuevo Post-it
            const nuevoPostIt = document.createElement('div');
            nuevoPostIt.className = 'post-it';
            
            // Centramos el post-it un poco respecto a donde hizo clic el cursor
            nuevoPostIt.style.left = `${posX - 125}px`; 
            nuevoPostIt.style.top = `${posY - 50}px`;
            
            // Le damos un color aleatorio pastel para que quede dinámico
            const coloresPastel = ['#fef5c1', '#ffccff', '#ccffff', '#ccffcc', '#ffebcd'];
            const colorAleatorio = coloresPastel[Math.floor(Math.random() * coloresPastel.length)];
            nuevoPostIt.style.backgroundColor = colorAleatorio;

            // Metemos el contenido dentro del nuevo post-it
            nuevoPostIt.innerHTML = `
                <p>${textoNota}</p>
                <span class="autor">${autorNota.startsWith('@') ? autorNota : '@' + autorNota}</span>
            `;

            // Clavamos físicamente el nuevo post-it en el lienzo
            lienzo.appendChild(nuevoPostIt);

            // Apagamos el modo creación para poder seguir navegando normal
            desactivarModoCreacion();
        });

        function desactivarModoCreacion() {
            modoCreacionActivo = false;
            document.body.classList.remove('modo-colocar');
            btnCrear.style.backgroundColor = '#ffffff';
        }

