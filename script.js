// =========================================================================
// SCRIPT DE DÉMARRAGE ET DE GESTION DE LA GALERIE
// =========================================================================

// Instance du Swiper de la Modale (Lightbox) - globale pour l'accès
let modalSwiperInstance = null;

// Fonction de chargement des données et d'initialisation
function init() {
    // 1. Charger les données de la galerie depuis images.json
    fetch('images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(images => {
            // 2. Créer la galerie principale et la modale
            createGallery(images);
        })
        .catch(error => {
            console.error('Erreur lors du chargement des images.json:', error);
            // Afficher un message d'erreur simple à l'utilisateur
            const gallerySection = document.getElementById('photos');
            gallerySection.innerHTML = '<p style="text-align:center; color:red;">Erreur de chargement des images. Veuillez vérifier le fichier images.json.</p>';
        });
        
    // 3. Initialisation des autres fonctionnalités (navigation mobile, etc.)
    initMobileNav();
}

// =========================================================================
// GALERIE - CREATION DU CAROUSEL & MISE À JOUR DU CHEMIN 'fotos/'
// =========================================================================

function createGallery(images) {
    const galleryWrapper = document.getElementById('gallery-wrapper');
    const modalWrapper = document.getElementById('modal-gallery-wrapper');
    
    // Vider les conteneurs existants
    galleryWrapper.innerHTML = '';
    modalWrapper.innerHTML = '';

    images.forEach((image, index) => {
        // --- 1. Création des slides pour le Carrousel Principal ---
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide', 'gallery-item');
        
        const imgElement = document.createElement('img');
        // CHEMIN MIS À JOUR VERS LE DOSSIER 'fotos'
        imgElement.src = `fotos/${image.filename}`;
        imgElement.alt = image.caption;
        imgElement.classList.add('carousel-img');
        imgElement.setAttribute('data-index', index); // Pour l'ouverture de la modale
        
        const captionDiv = document.createElement('div');
        captionDiv.classList.add('carousel-caption');
        captionDiv.textContent = image.caption;

        slide.appendChild(imgElement);
        slide.appendChild(captionDiv);
        galleryWrapper.appendChild(slide);


        // --- 2. Création des slides pour la Modale (Lightbox) ---
        const modalSlide = document.createElement('div');
        modalSlide.classList.add('swiper-slide');
        
        const modalImg = document.createElement('img');
        // CHEMIN MIS À JOUR VERS LE DOSSIER 'fotos'
        modalImg.src = `fotos/${image.filename}`;
        modalImg.alt = image.caption;
        
        modalSlide.appendChild(modalImg);
        modalWrapper.appendChild(modalSlide);
    });

    // --- 3. Initialisation du Swiper principal (Carrousel) ---
    new Swiper('.mySwiper', { 
        loop: true,
        spaceBetween: 30,
        centeredSlides: true,
        // Autoplay rétabli pour un diaporama automatique
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: true,
    });


    // --- 4. Initialisation de la Modale Swiper (Lightbox) ---
    modalSwiperInstance = new Swiper('.modal-swiper-container', {
        loop: true,
        navigation: {
            nextEl: '.modal-nav-next',
            prevEl: '.modal-nav-prev',
        },
        keyboard: true,
        mousewheel: true,
    });


    // --- 5. Gestion de l'ouverture de la Modale par clic sur l'image du carrousel ---
    const carouselImages = document.querySelectorAll('.carousel-img');
    const modal = document.getElementById('image-modal');
    const closeBtn = document.querySelector('.close-btn');

    carouselImages.forEach(img => {
        img.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            
            // Ouvrir la modale
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            
            // Mettre à jour l'index de départ du Swiper de la modale
            if (modalSwiperInstance) {
                modalSwiperInstance.slideToLoop(index);
            }
        });
    });

    // Fermeture de la modale
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    // Fermeture par la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

// =========================================================================
// NAVIGATION MOBILE
// =========================================================================
function initMobileNav() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (toggleButton && navList) {
        toggleButton.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Fermer le menu lors du clic sur un lien
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }
}


// Lance le script une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', init);
