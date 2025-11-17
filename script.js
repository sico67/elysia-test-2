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
                // Si le réseau échoue (404 Not Found, 500, etc.)
                throw new Error(`Erreur HTTP: ${response.status}. Le fichier images.json n'a pas été trouvé ou n'est pas accessible. Assurez-vous qu'il est à la racine.`);
            }
            // Vérifier que le contenu est bien JSON
            return response.json();
        })
        .then(images => {
            // 2. Créer la galerie principale et la modale
            createGallery(images);
        })
        .catch(error => {
            console.error('Erreur critique lors du chargement ou de l\'analyse de images.json:', error);
            
            // --- CORRECTION DU BUG D'ERREUR ICI ---
            // Tenter d'afficher un message d'erreur dans le conteneur de la galerie
            const gallerySection = document.getElementById('photos'); // L'ID de la section parente
            
            // On vérifie que le conteneur principal de la section existe avant de modifier son contenu
            if (gallerySection) { 
                // Afficher un message d'erreur détaillé pour l'utilisateur
                gallerySection.innerHTML = `
                    <div style="text-align:center; padding: 50px;">
                        <h2 style="color:red; font-size: 1.5em;">
                            Erreur de chargement des images.
                        </h2>
                        <p style="color:red; font-size: 1.2em; font-weight: bold; margin-top: 15px;">
                            Veuillez vérifier le fichier images.json (SyntaxError ou 404 Not Found).
                        </p>
                        <p style="color: grey; margin-top: 15px; font-size: 0.9em;">
                            Détail de l'erreur technique: ${error.message || 'Erreur inconnue'}
                        </p>
                    </div>
                `;
            } else {
                // Si même la section #photos n'est pas là, loggez une erreur plus profonde
                console.error("Le conteneur de la galerie (#photos) est introuvable dans le HTML.");
            }
        });
        
    // 3. Initialisation des autres fonctionnalités (navigation mobile, etc.)
    initMobileNav();
}

// =========================================================================
// GALERIE - CREATION DU CAROUSEL & MISE À JOUR DU CHEMIN 'fotos/'
// =========================================================================

function createGallery(images) {
    // Récupérer les conteneurs Swiper
    const galleryWrapper = document.getElementById('gallery-wrapper');
    const modalWrapper = document.getElementById('modal-gallery-wrapper');
    
    // Si les conteneurs du Swiper n'existent pas (vérification de sécurité)
    if (!galleryWrapper || !modalWrapper) {
        console.error("Les conteneurs swiper (gallery-wrapper ou modal-gallery-wrapper) sont manquants dans le HTML. La galerie ne peut pas être créée.");
        return; // Arrêter l'exécution de la fonction
    }

    // Vider les conteneurs existants
    galleryWrapper.innerHTML = '';
    modalWrapper.innerHTML = '';

    images.forEach((image, index) => {
        // --- 1. Création des slides pour le Carrousel Principal ---
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide', 'gallery-item');
        
        const imgElement = document.createElement('img');
        // CHEMIN VERS LE DOSSIER 'fotos'
        imgElement.src = `fotos/${image.filename}`;
        imgElement.alt = image.caption;
        imgElement.classList.add('carousel-img');
        imgElement.setAttribute('data-index', index);
        
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
        // CHEMIN VERS LE DOSSIER 'fotos'
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
