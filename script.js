// =========================================================================
// SCRIPT DE DÉMARRAGE ET DE GESTION DE LA GALERIE
// =========================================================================

let modalSwiperInstance = null; 

function init() {
    fetch('images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}. Le fichier images.json n'a pas été trouvé ou accessible.`);
            }
            return response.json();
        })
        .then(images => {
            createGallery(images);
        })
        .catch(error => {
            console.error('Erreur critique lors du chargement ou de l\'analyse de images.json:', error);
            
            const gallerySection = document.getElementById('photos');
            
            if (gallerySection) { 
                gallerySection.innerHTML = `
                    <div style="text-align:center; padding: 50px;">
                        <h2 style="color:red; font-size: 1.5em;">
                            Erreur de chargement des images.
                        </h2>
                        <p style="color:red; font-size: 1.2em; font-weight: bold; margin-top: 15px;">
                            Veuillez vérifier le fichier images.json (SyntaxError) et les chemins d'accès (sensible à la casse sur GitHub Pages).
                        </p>
                        <p style="color: grey; margin-top: 15px; font-size: 0.9em;">
                            Détail de l'erreur technique: ${error.message || 'Erreur inconnue'}
                        </p>
                    </div>
                `;
            } else {
                console.error("Le conteneur de la galerie (#photos) est introuvable dans le HTML.");
            }
        });
        
    initMobileNav();
}

function createGallery(images) {
    const galleryWrapper = document.getElementById('gallery-wrapper');
    const modalWrapper = document.getElementById('modal-gallery-wrapper');
    
    if (!galleryWrapper || !modalWrapper) {
        console.error("Les conteneurs swiper (gallery-wrapper ou modal-gallery-wrapper) sont manquants dans le HTML. La galerie ne peut pas être créée.");
        return; 
    }

    galleryWrapper.innerHTML = '';
    modalWrapper.innerHTML = '';

    images.forEach((image, index) => {
        // --- 1. Carrousel Principal ---
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide', 'gallery-item');
        
        const imgElement = document.createElement('img');
        // CORRECTION DU CHEMIN : Retire "fotos/" 
        imgElement.src = `${image.filename}`; 
        imgElement.alt = image.caption;
        imgElement.classList.add('carousel-img');
        imgElement.setAttribute('data-index', index);
        
        const captionDiv = document.createElement('div');
        captionDiv.classList.add('carousel-caption');
        captionDiv.textContent = image.caption;

        slide.appendChild(imgElement);
        slide.appendChild(captionDiv);
        galleryWrapper.appendChild(slide);


        // --- 2. Modale (Lightbox) ---
        const modalSlide = document.createElement('div');
        modalSlide.classList.add('swiper-slide');
        
        const modalImg = document.createElement('img');
        // CORRECTION DU CHEMIN : Retire "fotos/"
        modalImg.src = `${image.filename}`;
        modalImg.alt = image.caption;
        
        modalSlide.appendChild(modalImg);
        modalWrapper.appendChild(modalSlide);
    });

    // --- 3. Initialisation du Swiper principal ---
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

    // --- 4. Initialisation de la Modale Swiper ---
    modalSwiperInstance = new Swiper('.modal-swiper-container', {
        loop: true,
        navigation: {
            nextEl: '.modal-nav-next',
            prevEl: '.modal-nav-prev',
        },
        keyboard: true,
        mousewheel: true,
    });

    // --- 5. Gestion de la Modale ---
    const carouselImages = document.querySelectorAll('.carousel-img');
    const modal = document.getElementById('image-modal');
    const closeBtn = document.querySelector('.close-btn');

    carouselImages.forEach(img => {
        img.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            if (modalSwiperInstance) {
                modalSwiperInstance.slideToLoop(index);
            }
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

function initMobileNav() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (toggleButton && navList) {
        toggleButton.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
