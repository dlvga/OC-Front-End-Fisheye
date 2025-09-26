/**
 * Gestionnaire du système de tri des médias
 * Coordonne le dropdown de tri, l'affichage des médias et la réinitialisation des fonctionnalités
 */

import {MediaSortDropdown} from './MediaSortDropDown.js';
import {sortMedia} from '../utils/mediaSorter.js';
import {displayMedia} from './displayMedia.js';
import {initLikes} from './mediaLikesManager.js';
import {initMediaLightbox} from './mediaLightboxManager.js';

// Variables globales pour conserver les données et références
let originalMediaData = [];    // Copie des données originales non triées
let mediaContainer = null;     // Référence au container d'affichage des médias

/**
 * Initialise le système de tri des médias
 * Configure le dropdown et effectue le tri initial par popularité
 * @param {Array} photographerMedia - Données brutes des médias du photographe
 * @param {HTMLElement} displayContainer - Container DOM où afficher les médias triés
 */
export function initMediaSort(photographerMedia, displayContainer) {
    // Sauvegarde des données originales (copie pour éviter les mutations)
    originalMediaData = [...photographerMedia];

    // Stockage de la référence du container pour les futurs réaffichages
    mediaContainer = displayContainer;

    // Initialisation du composant dropdown accessible
    const sortDropdown = new MediaSortDropdown('#media-sort-button', '.media-sort-list');

    // Configuration du callback appelé lors des changements de sélection
    sortDropdown.onSelectionChange = handleSortChange;

    // Tri et affichage initial par popularité (comportement par défaut)
    handleSortChange('popularity');
}

/**
 * Gestionnaire appelé lors du changement de critère de tri
 * Effectue le tri, réaffiche les médias et réinitialise les fonctionnalités dépendantes
 * @param {string} sortCriteria - Critère de tri sélectionné ('popularity', 'date', 'title')
 */
function handleSortChange(sortCriteria) {

    // Application du tri sur les données originales (non mutées)
    const sortedMediaArray = sortMedia(originalMediaData, sortCriteria);

    // Nettoyage complet du container et ajout du titre avant réaffichage
    mediaContainer.innerHTML = '<h2 class="sr-only">Galerie du photographe</h2>';

    // Génération et injection des nouvelles cartes médias triées
    displayMedia(sortedMediaArray, mediaContainer);

    // Réinitialisation des fonctionnalités dépendantes de l'affichage

    // 1) Système de likes : nouveaux event listeners sur les nouvelles cartes
    initLikes();

    // 2) Lightbox : mise à jour des données et event listeners sur les nouveaux liens
    initMediaLightbox(mediaContainer, sortedMediaArray);
}