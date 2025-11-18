// =========================================================================
// ELYSIA NATURE & SPA - SCRIPT PRINCIPAL OPTIMISÉ
// =========================================================================

let mainSwiperInstance = null;
let modalSwiperInstance = null;

// =========================================================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// =========================================================================
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initMobileMenu();
    initSmoothScroll();
});

// =========================================================================
// CHARGEMENT ET CRÉATION DE LA GALERIE
// =========================================================================
async function initGallery() {
    try {
        const response = await fetch('images.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Le fichier images.json est introuvable ou inaccessible.`);
        }
        
        const images = await response.json();
        
        if (!Array.isArray(images) || images.length === 0) {
            throw new Error('Le fichier images.json est vide ou mal formaté.');
        }
        
        buildGallery(images);
        
    } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
        displayGalleryError(error.message);
    }
}

// =========================================================================
// CONSTRUCTION DE LA GALERIE
// =========================================================================
function buildGallery(images) {
    const galleryWrapper = document.getElementById('gallery-wrapper');
    const modalWrapper = document.getElementById('modal-gallery-wrapper');
    
    if (!galleryWrapper || !modalWrapper) {
        console.error('Erreur: Les conteneurs de la galerie sont introuvables dans le HTML.');
        return;
    }

    // Vider les conteneurs
    galleryWrapper.innerHTML = '';
    modalWrapper.innerHTML = '';

    // Construire les slides
    images.forEach((image, index) => {
        // Slide du carrousel principal
        const slide = createGallerySlide(image, index);
        galleryWrapper.appendChild(slide);
        
        // Slide de la modale
        const modalSlide = createModalSlide(image);
        modalWrapper.appendChild(modalSlide);
    });

    // Initialiser les carrousels Swiper
    initMainSwiper();
    initModalSwiper();
    
    // Activer la lightbox au clic
    attachGalleryClickHandlers();
}

// =========================================================================
// CRÉATION DES ÉLÉMENTS DE GALERIE
// =========================================================================
function createGallerySlide(image, index) {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'gallery-item');
    
    const img = document.createElement('img');
    img.src = `${image.filename}`;
    img.alt = image.caption;
    img.classList.add('carousel-img');
    img.setAttribute('data-index', index);
    img.loading = 'lazy';
    
    const caption = document.createElement('div');
    caption.classList.add('carousel-caption');
    caption.textContent = image.caption;
    
    slide.appendChild(img);
    slide.appendChild(caption);
    
    return slide;
}

function createModalSlide(image) {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    
    // Ajouter le conteneur de zoom requis par Swiper
    const zoomContainer = document.createElement('div');
    zoomContainer.classList.add('swiper-zoom-container');
    
    const img = document.createElement('img');
    img.src = `${image.filename}`;
    img.alt = image.caption;
    
    zoomContainer.appendChild(img);
    slide.appendChild(zoomContainer);
    
    return slide;
}

// =========================================================================
// INITIALISATION DU CARROUSEL PRINCIPAL
// =========================================================================
function initMainSwiper() {
    mainSwiperInstance = new Swiper('.mySwiper', {
        loop: true,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
        },
        effect: 'slide',
        speed: 600,
    });
}

// =========================================================================
// INITIALISATION DU CARROUSEL MODAL
// =========================================================================
function initModalSwiper() {
    modalSwiperInstance = new Swiper('.modal-swiper-container', {
        loop: true,
        navigation: {
            nextEl: '.modal-nav-next',
            prevEl: '.modal-nav-prev',
        },
        keyboard: {
            enabled: true,
        },
        mousewheel: {
            forceToAxis: true,
        },
        zoom: {
            maxRatio: 3,
            minRatio: 1,
            toggle: true,
        },
        speed: 400,
    });
}

// =========================================================================
// GESTION DE LA LIGHTBOX (MODALE)
// =========================================================================
function attachGalleryClickHandlers() {
    const galleryImages = document.querySelectorAll('.carousel-img');
    const modal = document.getElementById('image-modal');
    const closeBtn = modal.querySelector('.close-btn');
    
    // Ouvrir la modale au clic sur une image
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openModal(index);
        });
    });
    
    // Fermer la modale
    closeBtn.addEventListener('click', closeModal);
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Fermer en cliquant en dehors de l'image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openModal(index) {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    if (modalSwiperInstance) {
        modalSwiperInstance.slideToLoop(index, 0);
    }
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// =========================================================================
// AFFICHAGE D'ERREUR POUR LA GALERIE
// =========================================================================
function displayGalleryError(message) {
    const gallerySection = document.getElementById('photos');
    
    if (gallerySection) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'text-align: center; padding: 50px; background: #fee; border-radius: 10px; margin: 20px;';
        
        errorDiv.innerHTML = `
            <h3 style="color: #c00; margin-bottom: 15px;">
                ⚠️ Erreur de chargement de la galerie
            </h3>
            <p style="color: #600; font-size: 1.1em; margin-bottom: 10px;">
                ${message}
            </p>
            <p style="color: #666; font-size: 0.9em;">
                Vérifiez que le fichier <strong>images.json</strong> existe à la racine du site 
                et que le dossier <strong>fotos/</strong> contient les images.
            </p>
        `;
        
        const container = gallerySection.querySelector('.container');
        container.appendChild(errorDiv);
    }
}

// =========================================================================
// MENU MOBILE
// =========================================================================
function initMobileMenu() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!toggleButton || !navList) return;
    
    // Toggle du menu
    toggleButton.addEventListener('click', function() {
        navList.classList.toggle('active');
        const icon = this.querySelector('.material-icons');
        icon.textContent = navList.classList.contains('active') ? 'close' : 'menu';
    });
    
    // Fermer le menu au clic sur un lien
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
            const icon = toggleButton.querySelector('.material-icons');
            icon.textContent = 'menu';
        });
    });
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!toggleButton.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
            const icon = toggleButton.querySelector('.material-icons');
            icon.textContent = 'menu';
        }
    });
}

// =========================================================================
// SMOOTH SCROLL POUR LES ANCRES
// =========================================================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========================================================================
// OPTIMISATION: LAZY LOADING DES IMAGES
// =========================================================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observer les images avec data-src (si vous en ajoutez)
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
