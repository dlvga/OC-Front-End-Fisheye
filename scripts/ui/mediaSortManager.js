import { sortMedia } from '../utils/mediaSorter.js';
import { displayMedia } from './displayMedia.js';
import {initMediaLightbox} from "./mediaLightboxManager.js";
import {initLikes} from "./mediaLikesManager.js";

let originalMediaArray = [];
let currentSortCriterion = 'popularity';

/**
 * Initialise le gestionnaire de tri des médias
 * @param {Array} mediaArray - Tableau original des médias
 * @param {HTMLElement} mediaContainer - Container d'affichage des médias
 */
export function initMediaSort(mediaArray, mediaContainer) {
    originalMediaArray = [...mediaArray];

    const sortSelect = document.getElementById('media-sort');
    if (!sortSelect) {
        console.warn('Sélecteur de tri non trouvé');
        return;
    }

    // Écouteur de changement
    sortSelect.addEventListener('change', (e) => {
        const newSortCriterion = e.target.value;
        applySorting(newSortCriterion, mediaContainer);
    });

    // Tri initial par popularité
    applySorting(currentSortCriterion, mediaContainer);
}

/**
 * Applique le tri et met à jour l'affichage
 * @param {string} sortBy - Critère de tri
 * @param {HTMLElement} mediaContainer - Container d'affichage
 */
function applySorting(sortBy, mediaContainer) {
    currentSortCriterion = sortBy;

    // Trier les médias
    const sortedMedia = sortMedia(originalMediaArray, sortBy);

    // Réorganiser les éléments existants au lieu de les recréer pour préserver les états (listeners)
    const existingCards = Array.from(mediaContainer.children);
    mediaContainer.innerHTML = '';

    sortedMedia.forEach(media => {
        const card = existingCards.find(el => el.dataset.id === String(media.id));
        if (card) mediaContainer.appendChild(card);
    });

    initMediaLightbox(mediaContainer, sortedMedia);

    // Annoncer le changement pour l'accessibilité
    announceSort(sortBy);
}

/**
 * Annonce le changement de tri pour l'accessibilité
 * @param {string} sortBy - Critère de tri appliqué
 */
function announceSort(sortBy) {
    const sortLabels = {
        'popularity': 'Popularité',
        'date': 'Date',
        'title': 'Titre'
    };

    const message = `Médias triés par ${sortLabels[sortBy]}`;

    // Créer un élément temporaire pour l'annonce
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Supprimer après l'annonce
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Retourne le critère de tri actuellement appliqué
 */
export function getCurrentSortCriterion() {
    return currentSortCriterion;
}