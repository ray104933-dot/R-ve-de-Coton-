/**
 * RÊVE DE COTON - SCRIPT PRINCIPAL
 * Version : Optimisée
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ===============================================================
       1. DONNÉES : LES UNIVERS (TARIFS & INFOS)
       =============================================================== */
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
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                // Animation d'entrée douce
                navLinks.style.animation = "fadeUp 0.3s ease forwards";
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
            const card = document.createElement('div');
            card.className = 'card fade-in';
            // Délai pour effet cascade
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
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));


    /* ===============================================================
       5. JEU CONCOURS (DATA TRAP & ROUE)
       =============================================================== */
    const dataForm = document.getElementById('dataForm');
    const wheelSection = document.getElementById('wheelSection');
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const resultMessage = document.getElementById('resultMessage');
    const formContainer = document.getElementById('formContainer');

    // A. Validation du formulaire
    if (dataForm) {
        dataForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const leadData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                date: document.getElementById('weddingDate').value,
                budget: document.getElementById('userBudget').value
            };

            /* ---------------------------------------------------------
             * NOTE POUR LE BACKEND JAVA :
             * Pour connecter le script à votre API Spring Boot,
             * décommentez le bloc ci-dessous et supprimez le mode "Simulation".
             * --------------------------------------------------------- */
            
            /*
            fetch('http://localhost:8080/api/game/participate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(leadData)
            })
            .then(res => {
                if(res.ok) {
                   unlockWheel(leadData.name);
                } else {
                   showToast("Erreur de connexion serveur", "error");
                }
            });
            */

            // --- MODE SIMULATION (Par défaut) ---
            console.log("Données capturées :", leadData);
            localStorage.setItem('last_lead_data', JSON.stringify(leadData));
            unlockWheel(leadData.name);
            // ------------------------------------
        });
    }

    function unlockWheel(name) {
        showToast("Informations validées avec succès !", "success");
        
        // Remplacement du formulaire par un message de succès
        formContainer.innerHTML = `
            <div style="text-align:center; padding:40px 20px; animation: fadeUp 0.5s ease;">
                <i class="ph ph-check-circle" style="font-size:4rem; color:#d4af37; margin-bottom:15px;"></i>
                <h3 style="color:white; margin-bottom:10px;">C'est validé !</h3>
                <p style="color:rgba(255,255,255,0.7);">
                    Merci ${name}.<br>
                    La roue est débloquée. À vous de jouer ! 👉
                </p>
            </div>
        `;
        
        wheelSection.classList.remove('blur-locked');
        spinBtn.disabled = false;
    }

    // B. Logique de la Roue (Truquée)
    if (spinBtn) {
        spinBtn.addEventListener('click', () => {
            spinBtn.disabled = true;
            spinBtn.innerText = "...";
            resultMessage.style.display = 'none';

            // Angles perdants (Segments gris : 120, 240, 360)
            const losingAngles = [120, 240, 360];
            const targetAngle = losingAngles[Math.floor(Math.random() * losingAngles.length)];
            
            // Calcul rotation : 10 tours + angle cible + variation réaliste
            const spins = 360 * 10; 
            const randomOffset = Math.floor(Math.random() * 20) - 10;
            const finalRotation = spins + targetAngle + randomOffset;

            wheel.style.transform = `rotate(${finalRotation}deg)`;

            // Résultat après 5s
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
            }, 5000);
        });
    }


    /* ===============================================================
       6. ESPACE CLIENT PRIVÉ (LOGIN & DASHBOARD)
       =============================================================== */
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModals = document.querySelectorAll('.close-modal');
    const loginForm = document.getElementById('loginForm');
    const clientDashboard = document.getElementById('clientDashboard');
    const publicSections = document.querySelectorAll('header, #philosophie, #univers, #options, #concours, #contact');

    // Ouverture Modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    // Fermeture Modal
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target == loginModal) loginModal.style.display = 'none';
    });

    // Connexion
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            const err = document.getElementById('loginError');

            if (u === "G.Gautheret" && p === "2Qv4jgH3") {
                loginModal.style.display = 'none';
                showToast("Bienvenue M. Gautheret.", "success");

                // Cacher le site public, afficher le dashboard
                publicSections.forEach(s => s.style.display = 'none');
                clientDashboard.style.display = 'block';
                window.scrollTo(0, 0);

                // Animation barre de progression
                setTimeout(() => {
                    const bar = document.querySelector('.progress-bar-fill');
                    if(bar) bar.style.width = "65%";
                }, 500);

            } else {
                err.style.display = 'block';
                const content = loginModal.querySelector('div');
                content.style.animation = "shake 0.5s ease";
                setTimeout(() => content.style.animation = "", 500);
            }
        });
    }

    // Déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast("Déconnexion...", "default");
            setTimeout(() => location.reload(), 1000);
        });
    }

    /* ===============================================================
       7. UTILITAIRE : TOAST NOTIFICATIONS
       =============================================================== */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        let icon = type === 'success' ? '<i class="ph ph-check-circle"></i>' : '<i class="ph ph-info"></i>';
        
        // Styles JS injectés pour éviter dépendance CSS externe
        Object.assign(toast.style, {
            position: 'fixed', bottom: '30px', right: '30px',
            backgroundColor: type === 'success' ? '#2c2c2c' : (type === 'error' ? '#c0392b' : '#8e7f7f'),
            color: 'white', padding: '15px 25px', borderRadius: '50px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: '10px',
            zIndex: '9999', opacity: '0', transform: 'translateY(20px)',
            transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        });
        
        toast.innerHTML = `${icon} <span style="font-weight:bold;">${message}</span>`;
        document.body.appendChild(toast);

        // Animation Entrée
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Animation Sortie
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => document.body.removeChild(toast), 400);
        }, 4000);
    }
    
    // Injection style keyframes pour "Shake" error
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(styleSheet);
});