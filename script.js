/**
 * RÊVE DE COTON - SCRIPT PRINCIPAL
 * Version : Premium / Complète
 * * Ce script gère :
 * 1. L'interface utilisateur (Menu, Scroll, Animations)
 * 2. La génération dynamique des offres
 * 3. La logique du Jeu Concours (Data Trap + Roue truquée)
 * 4. L'accès sécurisé à l'Espace Client (G. Gautheret)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ===============================================================
       1. DONNÉES : LES UNIVERS (TARIFS & INFOS)
       =============================================================== */
    // Ces données alimentent la section "Nos Univers" automatiquement.
    const formulasData = [
        { 
            name: "Bohème Chic", 
            rentPrice: "5 000", mealPrice: "90", 
            location: "Seine-et-Marne",
            details: "Corps de ferme rénové • Service en buffet • Ambiance champêtre",
            icon: "<i class='ph ph-plant'></i>"
        },
        { 
            name: "Prince & Princesse", 
            rentPrice: "10 000", mealPrice: "160", 
            location: "Yvelines",
            details: "Château restauré • Service à table • Photographe inclus",
            icon: "<i class='ph ph-crown'></i>"
        },
        { 
            name: "Rock'n Roll", 
            rentPrice: "3 000", mealPrice: "70", 
            location: "Reims",
            details: "Ancien diner américain • Groupe Live • Foodtrucks",
            icon: "<i class='ph ph-guitar'></i>"
        },
        { 
            name: "Danse & Disco", 
            rentPrice: "3 000", mealPrice: "100", 
            location: "Auxerre",
            details: "Salle de spectacle • Buffet • DJ Set & Light Show",
            icon: "<i class='ph ph-confetti'></i>"
        },
        { 
            name: "Mets & Vins", 
            rentPrice: "7 000", mealPrice: "200", 
            location: "Paris",
            details: "Restaurant gastronomique • Accord mets/vins • Mixologue",
            icon: "<i class='ph ph-wine'></i>"
        },
        { 
            name: "Wedding Colors", 
            rentPrice: "5 000", mealPrice: "100", 
            location: "Essonne",
            details: "Salle de réception modulable • Scénographie colorée",
            icon: "<i class='ph ph-palette'></i>"
        }
    ];

    /* ===============================================================
       2. INTERFACE : MENU & SCROLL
       =============================================================== */
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // A. Changement d'apparence de la barre au scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // B. Menu Mobile (Burger)
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            // Bascule l'affichage du menu
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
            }
        });
    }

    // C. Fermer le menu mobile quand on clique sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });

    /* ===============================================================
       3. GÉNÉRATION DES CARTES "UNIVERS"
       =============================================================== */
    const formulasContainer = document.getElementById('formulas-container');
    
    if (formulasContainer) {
        formulasData.forEach((formula, index) => {
            // Création de la carte HTML
            const card = document.createElement('div');
            card.className = 'card fade-in';
            // Ajout d'un délai pour l'effet "cascade" (la 2ème apparaît après la 1ère, etc.)
            card.style.transitionDelay = `${index * 100}ms`;

            card.innerHTML = `
                <div class="card-body">
                    <div class="card-icon">${formula.icon}</div>
                    <h3>${formula.name}</h3>
                    
                    <div class="card-price">
                        ${formula.rentPrice} € <span style="font-size:0.5em; text-transform:uppercase; color:#999; font-weight:normal;">Location</span>
                    </div>
                    
                    <div class="badge-meal">
                        + ${formula.mealPrice} € / pers (Repas)
                    </div>
                    
                    <p style="font-weight:bold; font-size:0.9rem; margin-top:15px; color:#555;">
                        <i class="ph ph-map-pin"></i> ${formula.location}
                    </p>
                    <p class="card-details">${formula.details}</p>
                </div>
            `;
            formulasContainer.appendChild(card);
        });
    }

    /* ===============================================================
       4. ANIMATIONS D'APPARITION (SCROLL REVEAL)
       =============================================================== */
    // Utilisation de l'API IntersectionObserver pour la performance
    const observerOptions = {
        threshold: 0.15, // L'élément doit être visible à 15% pour apparaître
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // On arrête d'observer une fois affiché
            }
        });
    }, observerOptions);

    // On cible tous les éléments qui ont les classes fade-in
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));


    /* ===============================================================
       5. JEU CONCOURS (ROUE TRUQUÉE & DATA TRAP)
       =============================================================== */
    const dataForm = document.getElementById('dataForm');
    const wheelSection = document.getElementById('wheelSection');
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const resultMessage = document.getElementById('resultMessage');
    const formContainer = document.getElementById('formContainer');

    // A. Gestion du Formulaire (Data Trap)
    if (dataForm) {
        dataForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Simulation de sauvegarde (localStorage)
            const leadData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                date: document.getElementById('weddingDate').value,
                budget: document.getElementById('userBudget').value
            };
            
            // On stocke les infos (C'est ici que tu montres au prof que tu as la data)
            localStorage.setItem('last_lead_data', JSON.stringify(leadData));

            // 2. Feedback Visuel (Success)
            showToast("Informations validées avec succès !", "success");
            
            // On remplace le formulaire par un message de confirmation
            formContainer.innerHTML = `
                <div style="text-align:center; padding:40px 20px; animation: fadeUp 0.5s ease;">
                    <i class="ph ph-check-circle" style="font-size:4rem; color:#d4af37; margin-bottom:15px;"></i>
                    <h3 style="color:white; margin-bottom:10px;">C'est validé !</h3>
                    <p style="color:rgba(255,255,255,0.7);">
                        Merci ${leadData.name}.<br>
                        La roue est débloquée. À vous de jouer ! 👉
                    </p>
                </div>
            `;

            // 3. Déblocage de la roue
            wheelSection.classList.remove('blur-locked');
            spinBtn.disabled = false;
        });
    }

    // B. Gestion de la Roue (Truquée pour perdre)
    if (spinBtn) {
        spinBtn.addEventListener('click', () => {
            // Désactive le bouton
            spinBtn.disabled = true;
            spinBtn.innerText = "...";
            resultMessage.style.display = 'none';

            // --- LOGIQUE DE TRICHE ---
            // La roue a 6 segments de 60°.
            // Segments "Perdu" (Gris) : S2, S4, S6.
            // Pour tomber dessus, il faut viser les angles : 120°, 240° ou 360°.
            
            const losingAngles = [120, 240, 360];
            // Choix aléatoire parmi les positions perdantes
            const targetAngle = losingAngles[Math.floor(Math.random() * losingAngles.length)];
            
            // Calcul de la rotation :
            // 10 tours complets (3600°) + l'angle cible + un petit décalage aléatoire réaliste (+/- 10°)
            const spins = 360 * 10; 
            const randomOffset = Math.floor(Math.random() * 20) - 10;
            const finalRotation = spins + targetAngle + randomOffset;

            // Application de la rotation CSS
            wheel.style.transform = `rotate(${finalRotation}deg)`;

            // --- RÉSULTAT APRÈS 5 SECONDES ---
            setTimeout(() => {
                showToast("La roue s'est arrêtée...", "default");
                
                resultMessage.style.display = 'block';
                resultMessage.innerHTML = `
                    <i class="ph ph-smiley-sad" style="font-size:2rem; color:#8e7f7f; margin-bottom:10px;"></i><br>
                    <span style="font-size:1.2rem; color:#2c2c2c;">Dommage...</span><br>
                    <span style="font-size:0.9rem; font-weight:normal; color:#666;">
                        La roue s'est arrêtée sur "Perdu".<br>
                        Mais bonne nouvelle : nous avons bien reçu vos infos pour votre devis !
                    </span>
                `;
                
                spinBtn.innerText = "FINI";
                spinBtn.style.background = "#ccc";
                spinBtn.style.color = "#666";
                spinBtn.style.cursor = "default";
                
            }, 5000); // 5000ms = Durée de la transition CSS
        });
    }


    /* ===============================================================
       6. ESPACE CLIENT PRIVÉ (G. GAUTHERET)
       =============================================================== */
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModals = document.querySelectorAll('.close-modal'); // Supporte plusieurs boutons fermer
    const loginForm = document.getElementById('loginForm');
    const clientDashboard = document.getElementById('clientDashboard');
    
    // Liste des sections publiques à cacher lors de la connexion
    const publicSections = document.querySelectorAll('header, #philosophie, #univers, #options, #concours, #contact');

    // A. Ouvrir le modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    // B. Fermer le modal
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    });

    // C. Fermer si on clique en dehors
    window.addEventListener('click', (e) => {
        if (e.target == loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // D. Logique de Connexion
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche le rechargement de page

            const userInput = document.getElementById('username').value;
            const passInput = document.getElementById('password').value;
            const errorMsg = document.getElementById('loginError');

            // --- VÉRIFICATION DES IDENTIFIANTS ---
            if (userInput === "G.Gautheret" && passInput === "2Qv4jgH3") {
                // 1. Connexion réussie
                loginModal.style.display = 'none';
                showToast("Connexion réussie. Bienvenue M. Gautheret.", "success");

                // 2. On cache tout le site public
                publicSections.forEach(section => {
                    section.style.display = 'none';
                });

                // 3. On affiche le dashboard
                clientDashboard.style.display = 'block';
                
                // 4. On remonte en haut de page
                window.scrollTo(0, 0);

                // 5. Petite animation de la barre de progression (Bonus visuel)
                setTimeout(() => {
                    const progressBar = document.querySelector('.progress-bar-fill');
                    if(progressBar) progressBar.style.width = "65%"; // Simule le chargement
                }, 500);

            } else {
                // Erreur
                errorMsg.style.display = 'block';
                errorMsg.innerText = "Identifiant ou mot de passe incorrect.";
                
                // Animation de secousse pour l'erreur
                const modalContent = loginModal.querySelector('div');
                modalContent.style.animation = "shake 0.5s ease";
                setTimeout(() => modalContent.style.animation = "", 500);
            }
        });
    }

    // E. Déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Le plus simple pour déconnecter : recharger la page
            showToast("Déconnexion en cours...", "default");
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }

    /* ===============================================================
       7. FONCTION UTILITAIRE : NOTIFICATIONS (TOASTS)
       =============================================================== */
    // Cette fonction crée des petites bulles de notification élégantes
    function showToast(message, type = 'success') {
        // Création de l'élément
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        // Icône selon le type
        let icon = type === 'success' ? '<i class="ph ph-check-circle"></i>' : '<i class="ph ph-info"></i>';
        
        // Style de base
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.right = '30px';
        toast.style.backgroundColor = type === 'success' ? '#2c2c2c' : '#8e7f7f'; // Noir ou Taupe
        toast.style.color = 'white';
        toast.style.padding = '15px 25px';
        toast.style.borderRadius = '50px';
        toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '10px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        toast.innerHTML = `${icon} <span style="font-weight:bold; font-family:var(--font-text);">${message}</span>`;
        
        document.body.appendChild(toast);

        // Animation Entrée
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);

        // Animation Sortie (après 4 secondes)
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 400);
        }, 4000);
    }
    
    // Ajout de l'animation Keyframe "shake" pour le mot de passe incorrect
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(styleSheet);

});