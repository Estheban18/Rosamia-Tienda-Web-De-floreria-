document.addEventListener('DOMContentLoaded', function() {
    // Mostrar modal de publicidad al cargar
    var publicidadModal = new bootstrap.Modal(document.getElementById('modalPublicidad'));
    publicidadModal.show();

    // Manejo del menú móvil
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    // Función para abrir el menú móvil
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll en el body
    }

    // Función para cerrar el menú móvil
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll en el body
    }

    // Event listeners para abrir/cerrar el menú
    mobileMenuToggle.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    menuOverlay.addEventListener('click', closeMobileMenu);

    // Cerrar el menú al hacer clic en un enlace
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.id.replace('-mobile', '');
            mostrarPagina(targetId.replace('nav-', ''));
            closeMobileMenu();
        });
    });

    // Event listeners para los enlaces del menú de escritorio
    document.querySelectorAll('.desktop-menu .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.id.replace('-desktop', '');
            mostrarPagina(targetId.replace('nav-', ''));
        });
    });

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'position-fixed bottom-0 end-0 p-3';
        notificacion.style.zIndex = '11';

        notificacion.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">Rosamía</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${mensaje}
                </div>
            </div>
        `;

        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    // Evento para los botones de pedido por WhatsApp
    document.querySelectorAll('.btn-pedido').forEach(button => {
        button.addEventListener('click', function() {
            const producto = this.closest('.card').querySelector('.card-title').textContent;
            mostrarNotificacion(`Redirigiendo a WhatsApp para pedir: ${producto}`);
        });
    });
    // Efecto de movimiento para videos al hacer scroll
    const videoContainers = document.querySelectorAll('.video-container');
    const videos = document.querySelectorAll('.video-container video');

    function checkVideoPosition() {
        videoContainers.forEach(container => {
            const containerPosition = container.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (containerPosition < screenPosition) {
                container.style.opacity = '1';
                container.style.transform = 'perspective(1000px) rotateY(0deg) translateY(0)';
            }
        });
    }

    // Mejorar la experiencia de reproducción de videos
    const playButtons = document.querySelectorAll('.play-button');

    // Función para reproducir/pausar video
    function toggleVideo(video, playButton) {
        // Pausar todos los demás videos
        videos.forEach(v => {
            if (v !== video) {
                v.pause();
                // Mostrar el botón de play para los videos pausados
                const container = v.closest('.video-container');
                const button = container.querySelector('.play-button');
                if (button) button.style.opacity = '1';
            }
        });

        // Reproducir o pausar el video actual
        if (video.paused) {
            video.play();
            playButton.style.opacity = '0'; // Ocultar el botón de play
        } else {
            video.pause();
            playButton.style.opacity = '1'; // Mostrar el botón de play
        }
    }

    // Configurar los contenedores de video para ser clickeables
    videoContainers.forEach((container, index) => {
        container.addEventListener('click', function(e) {
            const video = videos[index];
            const playButton = playButtons[index];

            // Evitar que el clic se propague si se hace clic en el botón de play
            if (e.target.closest('.play-button') === playButton) {
                return;
            }

            toggleVideo(video, playButton);
        });
    });

    // Configurar los botones de reproducción
    playButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el clic se propague al contenedor
            const video = videos[index];
            toggleVideo(video, button);
        });
    });

    // Configurar eventos para los videos
    videos.forEach((video, index) => {
        const playButton = playButtons[index];

        // Mostrar el botón de play cuando el video termina
        video.addEventListener('ended', function() {
            playButton.style.opacity = '1';
        });

        // Mostrar el botón de play cuando el video se pausa
        video.addEventListener('pause', function() {
            playButton.style.opacity = '1';
        });

        // Ocultar el botón de play cuando el video se reproduce
        video.addEventListener('play', function() {
            playButton.style.opacity = '0';
        });

        // Asegurarse de que los videos se puedan reproducir
        video.addEventListener('canplay', function() {
            video.style.opacity = '1';
        });

        // Manejar errores de video
        video.addEventListener('error', function() {
            console.error('Error al cargar el video:', video.querySelector('source').src);
            video.closest('.video-container').innerHTML = '<div class="p-4 text-center text-danger">Error al cargar el video</div>';
        });

        // Evitar que los clics en el video se propaguen al contenedor
        video.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleVideo(video, playButton);
        });
    });

    window.addEventListener('scroll', checkVideoPosition);
    checkVideoPosition(); // Ejecutar al cargar la página

    // Navegación entre páginas
    document.getElementById('nav-inicio').addEventListener('click', function(e) {
        e.preventDefault();
        mostrarPagina('inicio');
    });

    document.getElementById('nav-nosotros').addEventListener('click', function(e) {
        e.preventDefault();
        mostrarPagina('nosotros');
    });

    document.getElementById('nav-productos').addEventListener('click', function(e) {
        e.preventDefault();
        mostrarPagina('productos');
    });

    document.getElementById('nav-clientes').addEventListener('click', function(e) {
        e.preventDefault();
        mostrarPagina('clientes');
    });

    // Manejo de enlaces del menú
    const menuLinks = document.querySelectorAll('.nav-link');
    
    // Función para mostrar la página correspondiente
    function mostrarPagina(id) {
        // Ocultar todas las páginas
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.remove('active');
        });
        
        // Mostrar la página seleccionada
        const paginaSeleccionada = document.getElementById(id);
        if (paginaSeleccionada) {
            paginaSeleccionada.classList.add('active');
        }
        
        // Actualizar el enlace activo en el menú de escritorio
        document.querySelectorAll('.desktop-menu .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
            }
        });

        // Actualizar el enlace activo en el menú móvil
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
            }
        });

        // Scroll al inicio
        window.scrollTo(0, 0);
    }
    
    // Agregar event listeners a los enlaces
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.id.replace('nav-', '').replace('-desktop', '').replace('-mobile', '');
            mostrarPagina(id);
            
            // Si está en móvil, cerrar el menú
            const mobileMenu = document.getElementById('mobile-menu');
            const menuOverlay = document.getElementById('menu-overlay');
            if (mobileMenu && menuOverlay) {
                mobileMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
            }
        });
    });
    
    // Mostrar la página de inicio por defecto
    mostrarPagina('inicio');
});

// Función para el scroll horizontal de clientes
function scrollClientes(direction) {
    const container = document.getElementById('clientesScroll');
    const scrollAmount = 300;
    
    if (container) {
        if (direction === 'left') {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}

// Autoplay para los testimonios
let autoplayInterval;

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        const container = document.getElementById('clientesScroll');
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll) {
            // Si llegamos al final, volvemos al inicio
            container.scrollLeft = 0;
        } else {
            // Avanzamos al siguiente testimonio
            scrollClientes('right');
        }
    }, 3000); // Cambia cada 3 segundos
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// Iniciar autoplay cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    const clientesContainer = document.getElementById('clientesScroll');
    
    // Iniciar autoplay
    startAutoplay();
    
    // Detener autoplay cuando el usuario interactúa
    clientesContainer.addEventListener('mouseenter', stopAutoplay);
    clientesContainer.addEventListener('touchstart', stopAutoplay);
    
    // Reanudar autoplay cuando el usuario deja de interactuar
    clientesContainer.addEventListener('mouseleave', startAutoplay);
    clientesContainer.addEventListener('touchend', startAutoplay);
});