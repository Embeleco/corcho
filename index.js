                // Tamaño del lienzo del corcho
        // const SUPABASE_URL = 'https://pwisexqdcresgevbgkaz.supabase.co'; 
        // const SUPABASE_ANON_KEY = 'sb_publishable_OgJFosGU24LRz3f6EBBDpw_mmAQBR9p'; 
        // const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const ANCHO_CORCHO = 5000;
        const ALTO_CORCHO = 5000;
        // const HORAS_DURACION = 48;
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
            // 1. Bloqueo de enlaces/links (Evita porno, virus y spam)
            const contieneLinks = /https?:\/\/|www\.|[\w-]+\.(com|net|org|es|edu|info|xyz|tk|online|site|sex|porn|xxx)/i.test(textoNota);
            if (contieneLinks) {
            alert("🚨 Por seguridad, no se permiten enlaces ni páginas web en el corcho.");
            desactivarModoCreacion();
            return; // Frena el código y no crea la nota
            }
            // 2. Lista negra de palabras prohibidas (Amplíala con las que quieras)
            const palabrasProhibidas = [
            "porno", "porn", "xxx", "sexo", "fuck", "polla", "coño", 
            "puta", "puto", "nazi", "maricon", "subnormal", "gilipollas"
            ];
            // Comprobamos si el texto tiene alguna palabra de la lista negra
            const textoEnMinusculas = textoNota.toLowerCase();
            const contieneBarbaridades = palabrasProhibidas.some(palabra => textoEnMinusculas.includes(palabra));
            if (contieneBarbaridades) {
            alert("🛑 Tu nota contiene palabras no permitidas. Mantengamos el corcho limpio y buen rollo en el campus.");
            desactivarModoCreacion();
            return; // Frena el código y no crea la nota
            }
            // 3. Límite de caracteres (Para que no pongan un texto gigante que rompa el post-it)
            if (textoNota.length > 150) {
            alert("📏 La nota es demasiado larga. El máximo son 150 caracteres.");
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
       

let nombreUsuarioChat = ""; // Guardará el apodo del alumno
let canalChat; // El canal en tiempo real

// 1. CONTROL DE ABRIR/CERRAR CHAT
const btnAbrirChat = document.getElementById('btn-abrir-chat');
const btnCerrarChat = document.getElementById('btn-cerrar-chat');
const ventanaChat = document.getElementById('ventana-chat');

btnAbrirChat.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // LOGIN RÁPIDO: Si el usuario no tiene nombre todavía, se lo pedimos
    if (!nombreUsuarioChat) {
        const apodo = prompt("Introduce tu apodo o nombre para entrar al chat de la Uni:");
        if (!apodo || apodo.trim() === "") return; // Si cancela, no abre el chat
        nombreUsuarioChat = apodo.trim();
    }
    
    ventanaChat.classList.remove('cerrado');
});

btnCerrarChat.addEventListener('click', () => {
    ventanaChat.classList.add('cerrado');
});


// 2. SISTEMA EN TIEMPO REAL CON SUPABASE (BROADCAST)
// Nos unimos a una sala de chat virtual llamada 'sala-campus'
canalChat = supabase.channel('sala-campus');

// Escuchamos cuando llegue un mensaje de otra persona en vivo
canalChat.on('broadcast', { event: 'mensaje-nuevo' }, (payload) => {
    pintarMensajeEnPantalla(payload.payload.usuario, payload.payload.texto);
}).subscribe();


// 3. ENVIAR UN MENSAJE AL PULSAR EL BOTÓN
const inputMsg = document.getElementById('input-msg');
const btnEnviarMsg = document.getElementById('btn-enviar-msg');

function enviarMensaje() {
    const texto = inputMsg.value.trim();
    if (texto === "" || !nombreUsuarioChat) return;

    // Emitimos el mensaje a internet para que le llegue a todos los que estén conectados
    canalChat.send({
        type: 'broadcast',
        event: 'mensaje-nuevo',
        payload: { usuario: nombreUsuarioChat, texto: texto }
    });

    // También lo pintamos en nuestra propia pantalla
    pintarMensajeEnPantalla("Tú (" + nombreUsuarioChat + ")", texto);
    inputMsg.value = ""; // Limpiamos el cuadro
}

btnEnviarMsg.addEventListener('click', enviarMensaje);
inputMsg.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviarMensaje(); });


// 4. FUNCIÓN AUXILIAR PARA DIBUJAR LAS BURBUJAS DE TEXTO
function pintarMensajeEnPantalla(usuario, texto) {
    const contenedorMensajes = document.getElementById('chat-mensajes');
    const burbuja = document.createElement('div');
    burbuja.className = 'msg-burbuja';
    
    burbuja.innerHTML = `<strong>${usuario}</strong><p>${texto}</p>`;
    contenedorMensajes.appendChild(burbuja);
    
    // Auto-scroll automático hacia abajo para leer el último mensaje
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
}

// Bloquear el arrastre del mapa si el usuario está interactuando con el chat
window.addEventListener('mousedown', (e) => {
    if (e.target.closest('#ventana-chat') || e.target.closest('.header-campus')) return;
    // ... tu código de mousedown original de arrastrar el mapa ...
});

