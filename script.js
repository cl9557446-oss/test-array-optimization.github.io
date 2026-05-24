// --- VARIABLES Y CONFIGURACIÓN ---
const colores = ['roja', 'rosa', 'morada'];
const cantidadFlores = 12; 

const jardinFlores = document.getElementById('jardin-flores');
const grupoTallos = document.getElementById('grupo-tallos');
const mensajeDinamico = document.getElementById('mensaje-dinamico');
const fechaReloj = document.getElementById('fecha-reloj');
const btnReinicio = document.getElementById('btn-reinicio');

const pantallaInicio = document.getElementById('pantalla-inicio');
const btnAbrir = document.getElementById('btn-abrir');
const musicaFondo = document.getElementById('musica-fondo');

// Mensajes interactivos románticos aleatorios para mayor dinamismo
const dedicatorias = [
    "Eres la persona más especial de mi universo. ✨",
    "Cada pétalo de este ramo lleva un pensamiento bonito para ti. ❤️",
    "Gracias por iluminar mis días con tu sonrisa. 🌸",
    "Este detalle fue programado con mucho amor para ti. 💻🌹",
    "Espero que este ramo digital te robe una sonrisa hoy. 💜"
];

// --- MANEJO DE AUDIO Y BIENVENIDA ---
btnAbrir.addEventListener('click', () => {
    pantallaInicio.classList.add('oculto');
    
    // Reproducción segura manejando la Promesa nativa del navegador
    const inicioAudio = musicaFondo.play();
    if (inicioAudio !== undefined) {
        inicioAudio.catch(error => {
            console.warn("El auto-play fue restringido por el navegador, se activará al primer toque:", error);
            // Intento secundario de respaldo por si falla la política estricta de hardware móvil
            document.body.addEventListener('touchstart', () => {
                musicaFondo.play();
            }, { once: true });
        });
    }
});

// --- LÓGICA DE CONSTRUCCIÓN DEL RAMO 2.5D ---
function construirRamo() {
    // Usamos DocumentFragment para optimizar el rendimiento y evitar renders repetitivos en el celular
    const fragmentoFlores = document.createDocumentFragment();
    const fragmentoTallos = document.createDocumentFragment();

    jardinFlores.innerHTML = '';
    grupoTallos.innerHTML = '';

    // Coordenadas espaciales manuales optimizadas para la cuadrícula 400x500
    const coordenadas = [
        { x: 190, y: 110, z: 20 },  { x: 140, y: 130, z: 10 },  { x: 240, y: 130, z: 15 },
        { x: 90,  y: 170, z: 5 },   { x: 190, y: 170, z: 25 },  { x: 290, y: 170, z: 8 },
        { x: 140, y: 210, z: 30 },  { x: 240, y: 210, z: 35 },  { x: 190, y: 240, z: 40 },
        { x: 80,  y: 230, z: -5 },  { x: 300, y: 230, z: -2 },  { x: 190, y: 50,  z: 0 }
    ];

    coordenadas.forEach((coord) => {
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        
        // 1. Crear Estructura de la Flor 3D
        const flor = document.createElement('div');
        flor.className = `flor-3d ${colorAleatorio}`;
        flor.style.left = `${coord.x - 45}px`;
        flor.style.top = `${coord.y - 45}px`;
        flor.style.transform = `translateZ(${coord.z}px)`;

        // Capa Externa de Pétalos
        const capaExterna = document.createElement('div');
        capaExterna.className = 'capa-petalos';
        for(let i = 0; i < 6; i++) {
            const petalo = document.createElement('div');
            petalo.className = 'petalo';
            capaExterna.appendChild(petalo);
        }

        // Capa Interna de Pétalos
        const capaInterna = document.createElement('div');
        capaInterna.className = 'capa-petalos capa-interna';
        for(let i = 0; i < 6; i++) {
            const petalo = document.createElement('div');
            petalo.className = 'petalo';
            capaInterna.appendChild(petalo);
        }

        // Centro/Pistilo de la Flor
        const centro = document.createElement('div');
        centro.className = 'centro-flor';

        flor.appendChild(capaExterna);
        flor.appendChild(capaInterna);
        flor.appendChild(centro);
        fragmentoFlores.appendChild(flor);

        // 2. Cálculos trigonométricos vectoriales de los tallos hacia el centro de la canasta
        const baseCanastaX = 200; 
        const baseCanastaY = 430; 
        const dx = coord.x - baseCanastaX;
        const dy = baseCanastaY - coord.y;
        const longitudTallo = Math.sqrt(dx * dx + dy * dy);
        const anguloTallo = Math.atan2(dx, dy) * (180 / Math.PI);

        const tallo = document.createElement('div');
        tallo.className = 'tallo-linea';
        tallo.style.left = `${baseCanastaX}px`;
        tallo.style.height = `${longitudTallo}px`;
        tallo.style.transform = `rotate(${-anguloTallo}deg) translateZ(${coord.z - 10}px)`;

        fragmentoTallos.appendChild(tallo);

        // Función manejadora de la interacción con las flores
        const procesarToqueFlor = () => {
            let emojis = colorAleatorio === 'roja' ? '❤️🌹' : colorAleatorio === 'rosa' ? '💖🌸' : '💜🌷';
            const fraseAleatoria = dedicatorias[Math.floor(Math.random() * dedicatorias.length)];
            
            mensajeDinamico.style.transform = 'scale(0.9)';
            mensajeDinamico.style.opacity = '0.7';
            
            setTimeout(() => {
                mensajeDinamico.innerHTML = `${fraseAleatoria} ${emojis}`;
                mensajeDinamico.style.transform = 'scale(1)';
                mensajeDinamico.style.opacity = '1';
            }, 150);
        };

        // Eventos duales para compatibilidad total (PC y Pantallas Táctiles)
        flor.addEventListener('click', (e) => {
            e.preventDefault();
            procesarToqueFlor();
        });
        flor.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Evita que el navegador lance un "double tap to zoom" erróneo
            procesarToqueFlor();
        }, { passive: false });
    });

    // Inyección masiva y limpia en el DOM real
    jardinFlores.appendChild(fragmentoFlores);
    grupoTallos.appendChild(fragmentoTallos);
}

// --- ACTUALIZACIÓN DE TIEMPO LOCAL (EL SALVADOR) ---
function inicializarReloj() {
    function actualizar() {
        const ahora = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/El_Salvador' };
        const horaString = ahora.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const fechaString = ahora.toLocaleDateString('es-SV', opciones);
        
        fechaReloj.innerHTML = `${fechaString.charAt(0).toUpperCase() + fechaString.slice(1)} — ${horaString}`;
    }
    actualizar();
    setInterval(actualizar, 1000);
}

// --- EVENTOS GENERALES ---
btnReinicio.addEventListener('click', () => {
    construirRamo();
    mensajeDinamico.innerHTML = "El ramo ha sido reorganizado con todo mi amor... ✨";
});

// Inicialización de arranque del script
construirRamo();
inicializarReloj(); 