document.addEventListener('DOMContentLoaded', function() {
            
    const gallerySwiperWrapper = document.getElementById('gallery-swiper-wrapper');
    const modalSwiperWrapper = document.getElementById("modal-swiper-wrapper");
    const modal = document.getElementById("lightboxModal");
    const closeBtn = document.querySelector(".close-btn");
    
    let mySwiperInstance; 
    let modalSwiperInstance; 
    
    // --- CHARGEMENT ASYNCHRONE DES DONNÉES JSON ---
    async function initializeGallery() {
        let allImagesData = [];
        const jsonPath = 'images.json'; 

        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} lors du chargement de ${jsonPath}`);
            }
            allImagesData = await response.json();
            
            buildGallery(allImagesData);
            
        } catch (error) {
            console.error("Échec du chargement des données d'images:", error);
            gallerySwiperWrapper.innerHTML = `<p style="text-align:center; color: red;">Erreur: Impossible de charger la galerie. Vérifiez le fichier 'images.json' et son chemin.</p>`;
        }
    }
    
    // --- FONCTION DE CONSTRUCTION DE LA GALERIE ---
    function buildGallery(imagesData) {
        if (imagesData.length === 0) {
            gallerySwiperWrapper.innerHTML = `<p style="text-align:center; color: red;">Erreur: Aucune image dans le fichier JSON. La galerie est vide.</p>`;
            return;
        }
        
        // Nettoyage pour le cas où la fonction serait appelée plusieurs fois
        gallerySwiperWrapper.innerHTML = ''; 

        imagesData.forEach((image) => {
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('swiper-slide', 'gallery-item');
            
            slideDiv.innerHTML = `
                <img src="${image.filename}" alt="${image.caption}" class="carousel-img" loading="lazy">
                <div class="carousel-caption">${image.caption}</div>
            `;
            gallerySwiperWrapper.appendChild(slideDiv);
        });

        // Initialisation du Swiper de la galerie
        mySwiperInstance = new Swiper('.mySwiper', {
            loop: true, 
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            slidesPerView: 1, 
            spaceBetween: 0,
        });
        
        addGalleryClickListeners(imagesData);
    }
    

    
    // --- Logique de la Lightbox (CORRIGÉE) ---
    function addGalleryClickListeners(imagesData) {
        const gallerySlides = document.querySelectorAll("#gallery-swiper-wrapper .swiper-slide");

        gallerySlides.forEach((slide, index) => {
            slide.addEventListener("click", () => {
                
                // 1. Reconstruire les slides de la modale
                modalSwiperWrapper.innerHTML = ''; 
                imagesData.forEach(image => {
                    const slideDiv = document.createElement('div');
                    slideDiv.classList.add('swiper-slide');
                    
                    const modalImg = document.createElement('img');
                    modalImg.src = image.filename;
                    modalImg.alt = image.caption;
                    slideDiv.appendChild(modalImg);
                    modalSwiperWrapper.appendChild(slideDiv);
                });

                // 2. Détruire l'ancienne instance si elle existe
                if (modalSwiperInstance) {
                    modalSwiperInstance.destroy(true, true);
                }
                
                // 3. Initialiser la nouvelle instance
                modalSwiperInstance = new Swiper('.modal-swiper-container', {
                    initialSlide: index, 
                    navigation: {
                        nextEl: '.modal-nav-next',
                        prevEl: '.modal-nav-prev',
                    },
                    loop: true,
                    slidesPerView: 1,
                    spaceBetween: 0,
                });

                // 4. Afficher le modal
                modal.style.display = "flex";
                document.body.style.overflow = "hidden";
                
                // AJOUT pour le CSS: marquer le body comme modale ouverte
                document.body.classList.add('modal-open');

                // 5. CORRECTION CLÉ : Mettre à jour Swiper après que la modale soit visible
                if (modalSwiperInstance) {
                    setTimeout(() => {
                        // Forcer Swiper à recalculer la taille des slides (souvent nécessaire dans les modales)
                        modalSwiperInstance.update(); 
                        // S'assurer que nous allons à la bonne slide
                        modalSwiperInstance.slideTo(index, 0);
                    }, 50); // Petit délai pour laisser le navigateur rendre l'affichage 'flex'
                }
            });
        });
    }

    // --- Fermeture de la Lightbox ---
    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        
        // CORRECTION: Retirer la classe 'modal-open'
        document.body.classList.remove('modal-open'); 

        if (modalSwiperInstance) {
            // Destruction complète pour libérer la mémoire et éviter les bugs
            modalSwiperInstance.destroy(true, true);
            modalSwiperInstance = null;
        }
    }
    
    if (modal) {
        if (closeBtn) {
            closeBtn.addEventListener("click", closeModal);
        }

        modal.addEventListener("click", (e) => {
            // Fermer si on clique en dehors du contenu de la modale
            if (e.target === modal) { 
                closeModal();
            }
        });
        
        // Fermeture avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    }
    
    // --- Menu mobile ---
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const navList = document.querySelector(".nav-list");
    
    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            navList.classList.toggle("active");
            const icon = mobileToggle.querySelector(".material-icons");
            icon.textContent = navList.classList.contains("active") ? "close" : "menu";
        });
    }

    // Fermeture automatique du menu lors d'un clic sur un lien
    document.querySelectorAll(".nav-list a").forEach(link => {
        link.addEventListener("click", () => {
            if (navList.classList.contains("active")) {
                navList.classList.remove("active");
                if (mobileToggle) {
                    mobileToggle.querySelector(".material-icons").textContent = "menu";
                }
            }
        });
    });
    
    // Lancement de la fonction principale
    initializeGallery();

}); // Fin du DOMContentLoaded
