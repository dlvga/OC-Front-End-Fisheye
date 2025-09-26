/**
 * Gestionnaire de la lightbox pour l'affichage des médias en plein écran
 * Gère la navigation clavier, le focus trap et l'accessibilité ARIA
 */

import {createElement} from "../utils/domUtils.js";
import MediaFactory from "../factories/MediaFactory.js";
import {createFocusTrap, focusElement, restoreFocus} from "../utils/focusTrap.js";

// Variables globales pour l'état de la lightbox
let currentMediaIndex = 0;           // Index du média actuellement affiché
let mediaArray = [];                 // Copie du tableau des médias pour la navigation
let lightboxContainer = null;        // Référence au container de la lightbox
let lastFocusedElement = null;       // Élément ayant le focus avant ouverture
let focusTrapCleanup = null;         // Fonction de nettoyage du focus trap

/**
 * Initialise la lightbox pour une collection de médias
 * Configure les event listeners et prépare la navigation
 * @param {HTMLElement} mediaContainer - Container contenant les cartes médias
 * @param {Array} photographerMedia - Tableau des données des médias
 */
export function initMediaLightbox(mediaContainer, photographerMedia) {
    // Stockage local des données pour la navigation entre médias
    mediaArray = photographerMedia;

    // Récupération de l'élément lightbox depuis le HTML statique
    lightboxContainer = document.getElementById('lightbox-modal');

    if (!lightboxContainer) {
        console.error('Lightbox: Container non trouvé dans le DOM');
        return;
    }

    // Configuration des écouteurs d'événements sur les liens des médias
    attachMediaClickListeners(mediaContainer);

    // Configuration des contrôles internes de la lightbox
    attachLightboxListeners();
}

/**
 * Attache les event listeners sur tous les liens de médias pour l'ouverture
 * Gère les clics, les événements clavier et les interactions tactiles
 * @param {HTMLElement} mediaContainer - Container des cartes médias
 */
function attachMediaClickListeners(mediaContainer) {
    const allMediaLinks = mediaContainer.querySelectorAll('.media-link');

    allMediaLinks.forEach(mediaLink => {
        /**
         * Gestionnaire unifié pour l'ouverture de la lightbox
         * @param {Event} triggerEvent - Événement déclencheur
         */
        const handleLightboxOpen = (triggerEvent) => {
            triggerEvent.preventDefault();

            // Récupération de l'ID du média depuis l'attribut data-id de la carte parente
            const mediaCard = mediaLink.closest('.media-card');
            const mediaId = mediaCard?.getAttribute('data-id');

            if (mediaId) {
                openLightbox(mediaId);
            }
        };

        // Événements
        mediaLink.addEventListener('click', handleLightboxOpen);

        // Navigation clavier (Entrée et Espace)
        mediaLink.addEventListener('keydown', (keyboardEvent) => {
            if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                handleLightboxOpen(keyboardEvent);
            }
        });
    });
}

/**
 * Ouvre la lightbox avec le média spécifié par son ID
 * @param {string} mediaId - Identifiant unique du média à afficher
 */
function openLightbox(mediaId) {

    // Recherche de l'index du média dans le tableau pour la navigation
    currentMediaIndex = mediaArray.findIndex(media => media.id === parseInt(mediaId));

    // Vérification de la validité de l'ID
    if (currentMediaIndex === -1) {
        console.warn('Média non trouvé:', mediaId);
        return;
    }

    // Sauvegarde de l'élément ayant le focus pour restauration à la fermeture
    lastFocusedElement = document.activeElement;

    // Affichage de la lightbox (classes CSS et attributs ARIA)
    lightboxContainer.classList.add('visible');
    lightboxContainer.removeAttribute('aria-hidden');

    // Génération dynamique du contenu média
    displayCurrentMedia();

    // Prévention du scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';

    // Gestion séquentielle du focus pour éviter les conflits d'animation
    // 1) Retrait du focus de l'élément déclencheur
    if (lastFocusedElement && typeof lastFocusedElement.blur === 'function') {
        lastFocusedElement.blur();
    }

    // 2) Focus temporaire sur le container lightbox pour stabiliser l'état
    if (!lightboxContainer.hasAttribute('tabindex')) {
        lightboxContainer.setAttribute('tabindex', '-1');
    }
    lightboxContainer.focus({ preventScroll: true });

    // 3) Focus sur le bouton fermer avec délai pour les animations CSS
    const closeButton = lightboxContainer.querySelector('.lightbox-close');
    if (closeButton) {
        // Délai de 150ms pour laisser les animations se stabiliser
        focusElement(closeButton, lightboxContainer, 150);
    } else {
        // Si pas de bouton fermer, masquer immédiatement le contenu principal
        toggleMainContentVisibility(true);
    }

    // 4) Activation du focus trap avec gestion des raccourcis clavier
    focusTrapCleanup = createFocusTrap(lightboxContainer, {
        onEscape: closeLightbox,
        onArrowLeft: goToPreviousMedia,
        onArrowRight: goToNextMedia
    });
}

/**
 * Met à jour dynamiquement le contenu de la lightbox avec le média actuel
 * Utilise le Factory Pattern pour créer le bon type d'élément (image/vidéo)
 */
function displayCurrentMedia() {
    const mediaContentContainer = lightboxContainer.querySelector('.lightbox-media-container');

    // Nettoyage du contenu précédent
    mediaContentContainer.innerHTML = '';

    // Récupération des données du média à afficher
    const currentMediaData = mediaArray[currentMediaIndex];

    // Création de l'instance média via la Factory (gère images et vidéos)
    const mediaModel = new MediaFactory(currentMediaData);

    // Génération de l'élément DOM approprié selon le type de média
    let mediaElement;
    if (mediaModel._image) {
        // Élément image avec attributs d'accessibilité
        mediaElement = createElement('img', {
            className: 'lightbox-image',
            attrs: {
                src: mediaModel.image,
                alt: mediaModel._title
            }
        });
    } else {
        // Élément vidéo avec contrôles natifs
        mediaElement = createElement('video', {
            className: 'lightbox-video',
            attrs: {
                src: mediaModel.video,
                controls: 'true',
                'aria-label': mediaModel._title
            }
        });
    }

    // Injection de l'élément média
    mediaContentContainer.appendChild(mediaElement);

    // Création du footer avec le titre du média
    const mediaFooter = createElement('div', {
        className: 'lightbox-footer'
    });

    const mediaTitle = createElement('h2', {
        className: 'lightbox-title',
        attrs: {
            id: 'lightbox-title'
        }
    });

    mediaFooter.appendChild(mediaTitle);
    mediaContentContainer.appendChild(mediaFooter);

    // Injection du titre
    mediaTitle.textContent = mediaModel._title;
}

/**
 * Navigue vers le média précédent dans la collection
 * Gère le bouclage (retour au dernier média depuis le premier)
 */
function goToPreviousMedia() {
    if (currentMediaIndex > 0) {
        currentMediaIndex--;
    } else {
        // Bouclage : du premier vers le dernier média
        currentMediaIndex = mediaArray.length - 1;
    }

    // Mise à jour de l'affichage avec le nouveau média
    displayCurrentMedia();

    // Maintien du focus approprié après navigation
    refocusAfterNavigation();
}

/**
 * Navigue vers le média suivant dans la collection
 * Gère le bouclage (retour au premier média depuis le dernier)
 */
function goToNextMedia() {
    if (currentMediaIndex < mediaArray.length - 1) {
        currentMediaIndex++;
    } else {
        // Bouclage : du dernier vers le premier média
        currentMediaIndex = 0;
    }

    // Mise à jour de l'affichage avec le nouveau média
    displayCurrentMedia();

    // Maintien du focus approprié après navigation
    refocusAfterNavigation();
}

/**
 * Gère le focus après navigation entre médias
 * Maintient l'élément focalisé ou retourne sur le bouton fermer
 */
function refocusAfterNavigation() {
    const currentlyFocusedElement = document.activeElement;

    // Si le focus est sur un bouton de navigation, le conserver
    if (currentlyFocusedElement && (
        currentlyFocusedElement.classList.contains('lightbox-prev') ||
        currentlyFocusedElement.classList.contains('lightbox-next')
    )) {
        // Le focus reste sur le bouton de navigation actuellement utilisé
        return;
    }

    // Sinon, replacer le focus sur le bouton fermer par défaut
    const closeButton = lightboxContainer.querySelector('.lightbox-close');
    if (closeButton) {
        closeButton.focus();
    }
}

/**
 * Ferme la lightbox et restaure l'état initial de la page
 * Suit un ordre précis pour éviter les problèmes de focus
 */
function closeLightbox() {
    // 1) Désactivation du focus trap en premier pour libérer la navigation
    if (focusTrapCleanup) {
        focusTrapCleanup();
        focusTrapCleanup = null;
    }

    // 2) Retrait du focus des éléments internes à la lightbox
    const currentActiveElement = document.activeElement;
    if (currentActiveElement && lightboxContainer.contains(currentActiveElement) && typeof currentActiveElement.blur === 'function') {
        currentActiveElement.blur();
    }

    // 3) Réaffichage du contenu principal (suppression d'aria-hidden)
    toggleMainContentVisibility(false);

    // 4) Restauration du focus sur l'élément d'origine ou un fallback sûr
    restoreFocus(lastFocusedElement);

    // 5) Masquage de la lightbox (après déplacement du focus hors de celle-ci)
    lightboxContainer.classList.remove('visible');
    lightboxContainer.setAttribute('aria-hidden', 'true');

    // 6) Restauration du scroll normal de la page
    document.body.style.overflow = '';
}

/**
 * Configure tous les event listeners internes de la lightbox
 * Attache les gestionnaires pour la fermeture et la navigation
 */
function attachLightboxListeners() {
    // Bouton de fermeture
    const closeButton = lightboxContainer.querySelector('.lightbox-close');
    closeButton.addEventListener('click', closeLightbox);

    // Boutons de navigation précédent/suivant
    const previousButton = lightboxContainer.querySelector('.lightbox-prev');
    const nextButton = lightboxContainer.querySelector('.lightbox-next');

    previousButton.addEventListener('click', goToPreviousMedia);
    nextButton.addEventListener('click', goToNextMedia);
}

/**
 * Masque ou affiche le contenu principal via aria-hidden
 * Nécessaire pour l'accessibilité lors de l'ouverture de la lightbox
 * @param {boolean} shouldHide - true pour masquer, false pour afficher
 */
function toggleMainContentVisibility(shouldHide) {
    // Éléments principaux de la page à masquer/afficher
    const mainContent = document.getElementById('main');
    const pageHeader = document.querySelector('body > header');
    const photographerStats = document.querySelector('.photographer-stats');

    // Application de l'état aria-hidden sur tous les éléments
    [mainContent, pageHeader, photographerStats].forEach(element => {
        if (element) {
            if (shouldHide) {
                element.setAttribute('aria-hidden', 'true');
            } else {
                element.removeAttribute('aria-hidden');
            }
        }
    });
}