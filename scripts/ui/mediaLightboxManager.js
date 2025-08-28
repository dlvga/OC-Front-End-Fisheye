// scripts/ui/mediaLightboxManager.js
import { createElement } from "../utils/domUtils.js";
import MediaFactory from "../factories/MediaFactory.js";
import {createFocusTrap, focusElement} from "../utils/focusTrap.js";

let currentMediaIndex = 0;
let mediaArray = [];
let lightboxContainer = null;
let lastFocusedElement = null;
let focusTrapCleanup = null;

/**
 * Initialise la lightbox pour les médias
 * @param {HTMLElement} container - Container des cartes médias
 * @param {Array} photographerMedia - Données des médias du photographe
 */
export function initMediaLightbox(container, photographerMedia) {
    // Stocker les données des médias
    mediaArray = photographerMedia;

    // Récupérer la lightbox existante du HTML
    lightboxContainer = document.getElementById('lightbox-modal');

    if (!lightboxContainer) {
        console.error('Lightbox container not found in HTML');
        return;
    }

    // Ajouter les event listeners sur les liens des médias
    attachMediaClickListeners(container);

    // Attacher les event listeners de la lightbox
    attachLightboxListeners();
}

/**
 * Ajoute les event listeners sur les liens des médias
 */
function attachMediaClickListeners(container) {
    const mediaLinks = container.querySelectorAll('.media-link');

    mediaLinks.forEach(link => {
        const openFromLink = (e) => {
            e.preventDefault();
            const mediaId = link.closest('.media-card')?.getAttribute('data-id');
            if (mediaId) openLightbox(mediaId);
        };
        link.addEventListener('pointerdown', openFromLink);
        link.addEventListener('mousedown', openFromLink);
        link.addEventListener('click', openFromLink);
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                openFromLink(e);
            }
        });
    });
}

/**
 * Ouvre la lightbox avec le média spécifié
 * @param {string} mediaId - ID du média à afficher
 */
function openLightbox(mediaId) {
    console.log('🔥 openLightbox called with ID:', mediaId);

    // Trouver l'index du média dans le tableau
    currentMediaIndex = mediaArray.findIndex(media => media.id === parseInt(mediaId));

    if (currentMediaIndex === -1) return;

    // Sauvegarder le focus actuel
    lastFocusedElement = document.activeElement;
    console.log('💾 Saved focus element:', lastFocusedElement);

    // Afficher la lightbox et supprimer aria-hidden (au lieu de le mettre à "false")
    lightboxContainer.classList.add('visible');
    lightboxContainer.removeAttribute('aria-hidden');
    console.log('👁️ Lightbox made visible');

    // Afficher le média actuel (DYNAMIQUE)
    displayCurrentMedia();

    // Empêcher le scroll
    document.body.style.overflow = 'hidden';

    // 1) Retirer explicitement le focus de l'élément déclencheur
    if (lastFocusedElement && typeof lastFocusedElement.blur === 'function') {
        lastFocusedElement.blur();
    }

    // 2) Focaliser le bouton Close dans la prochaine frame, puis masquer le contenu principal
    // Rendre le container focusable et lui donner le focus immédiatement
    if (!lightboxContainer.hasAttribute('tabindex')) {
        lightboxContainer.setAttribute('tabindex', '-1');
    }
    lightboxContainer.focus({ preventScroll: true });

    const closeBtn = lightboxContainer.querySelector('.lightbox-close');
    if (closeBtn) {
        //Délai pour laisser le temps au focus de se stabiliser à cause des animations
        focusElement(closeBtn, lightboxContainer, 150)
    } else {
        toggleMainContentVisibility(true);
    }

    // Utiliser l'utilitaire focusTrap avec support des flèches
    focusTrapCleanup = createFocusTrap(lightboxContainer, {
        onEscape: closeLightbox,
        onArrowLeft: goToPreviousMedia,
        onArrowRight: goToNextMedia
    });
    console.log('🔒 Focus trap created');
}

/**
 * Affiche dynamiquement le média actuel dans la lightbox
 */
function displayCurrentMedia() {
    const mediaContainer = lightboxContainer.querySelector('.lightbox-media-container');
    const titleElement = lightboxContainer.querySelector('.lightbox-title');

    // Vider le container (approche dynamique)
    mediaContainer.innerHTML = '';

    // Récupérer les données du média actuel
    const currentMediaData = mediaArray[currentMediaIndex];

    // Créer l'instance du média via la Factory
    const mediaModel = new MediaFactory(currentMediaData);

    // Créer l'élément média approprié
    let mediaElement;
    if (mediaModel._image) {
        mediaElement = createElement('img', {
            className: 'lightbox-image',
            attrs: {
                src: mediaModel.image,
                alt: mediaModel._title
            }
        });
    } else {
        mediaElement = createElement('video', {
            className: 'lightbox-video',
            attrs: {
                src: mediaModel.video,
                controls: 'true',
                'aria-label': mediaModel._title
            }
        });
    }

    // Injecter le média et le titre
    mediaContainer.appendChild(mediaElement);
    titleElement.textContent = mediaModel._title;
}

/**
 * Navigation vers le média précédent
 */
function goToPreviousMedia() {
    if (currentMediaIndex > 0) {
        currentMediaIndex--;
    } else {
        currentMediaIndex = mediaArray.length - 1; // Boucle au dernier média
    }
    displayCurrentMedia();

    // Refocus sur le bouton de navigation si nécessaire
    refocusAfterNavigation();
}

/**
 * Navigation vers le média suivant
 */
function goToNextMedia() {
    if (currentMediaIndex < mediaArray.length - 1) {
        currentMediaIndex++;
    } else {
        currentMediaIndex = 0; // Boucle au premier média
    }
    displayCurrentMedia();

    // Refocus sur le bouton de navigation si nécessaire
    refocusAfterNavigation();
}

/**
 * Remet le focus sur un élément approprié après navigation
 */
function refocusAfterNavigation() {
    // Si le focus était sur un bouton de navigation, le maintenir
    const activeElement = document.activeElement;
    if (activeElement && (
        activeElement.classList.contains('lightbox-prev') ||
        activeElement.classList.contains('lightbox-next')
    )) {
        // Le focus reste sur le bouton actuel
        return;
    }

    // Sinon, remettre le focus sur le bouton fermer
    const closeBtn = lightboxContainer.querySelector('.lightbox-close');
    if (closeBtn) {
        closeBtn.focus();
    }
}

/**
 * Ferme la lightbox
 */
function closeLightbox() {
    // 1) Retirer le focus trap d'abord
    if (focusTrapCleanup) {
        focusTrapCleanup();
        focusTrapCleanup = null;
    }

    // 2) Si un élément à l'intérieur de la lightbox a le focus, l'enlever
    const active = document.activeElement;
    if (active && lightboxContainer.contains(active) && typeof active.blur === 'function') {
        active.blur();
    }

    // 3) Réafficher le contenu principal (retire aria-hidden/inert)
    toggleMainContentVisibility(false);

    // 4) Restaurer le focus sur l'élément précédent (ou un fallback sûr)
    const fallback = document.querySelector('body > header a') || document.getElementById('main') || document.body;
    const target = (lastFocusedElement && document.contains(lastFocusedElement)) ? lastFocusedElement : fallback;
    if (target && typeof target.focus === 'function') {
        try { target.focus({ preventScroll: true }); } catch(_) { target.focus(); }
    }

    // 5) Cacher la lightbox (après avoir déplacé le focus hors de celle-ci)
    lightboxContainer.classList.remove('visible');
    lightboxContainer.setAttribute('aria-hidden', 'true');

    // 6) Restaurer le scroll
    document.body.style.overflow = '';
}

/**
 * Ajoute tous les event listeners de la lightbox
 */
function attachLightboxListeners() {
    // Bouton fermer
    const closeBtn = lightboxContainer.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);

    // Navigation
    const prevBtn = lightboxContainer.querySelector('.lightbox-prev');
    const nextBtn = lightboxContainer.querySelector('.lightbox-next');

    prevBtn.addEventListener('click', goToPreviousMedia);
    nextBtn.addEventListener('click', goToNextMedia);
}

/**
 * Masque/affiche le contenu principal (accessibilité)
 */
/*function toggleMainContentVisibility(hide) {
    const main = document.getElementById('main');
    const header = document.querySelector('body > header');
    const stats = document.querySelector('.photographer-stats');

    [main, header, stats].forEach(element => {
        if (!element) return;
        if (hide) {
            element.setAttribute('aria-hidden', 'true');
            // Empêche tout focus et interaction
            try { element.inert = true; } catch(_) {}
        } else {
            element.removeAttribute('aria-hidden');
            try { element.inert = false; } catch(_) {}
        }
    });
}*/

function toggleMainContentVisibility(hide) {
    const main = document.getElementById('main');
    const header = document.querySelector('body > header');
    const stats = document.querySelector('.photographer-stats');

    [main, header, stats].forEach(element => {
        if (element) {
            if (hide) {
                element.setAttribute('aria-hidden', 'true');
            } else {
                element.removeAttribute('aria-hidden');
            }
        }
    });
}
