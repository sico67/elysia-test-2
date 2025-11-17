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

