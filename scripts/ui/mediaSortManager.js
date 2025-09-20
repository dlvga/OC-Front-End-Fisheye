import {MediaSortDropdown} from './mediaSortDropdown.js';
import {sortMedia} from '../utils/mediaSorter.js';
import {displayMedia} from './displayMedia.js';
import {initLikes} from './mediaLikesManager.js';
import {initMediaLightbox} from './mediaLightboxManager.js';

let originalMediaData = [];
let mediaContainer = null;

export function initMediaSort(photographerMedia, container) {
    originalMediaData = [...photographerMedia];
    mediaContainer = container;

    // Initialiser le dropdown
    const dropdown = new MediaSortDropdown('#media-sort-button', '.media-sort-list');

    // Connecter le tri au changement de sélection
    dropdown.onSelectionChange = handleSortChange;

    // Tri initial (popularité)
    handleSortChange('popularity');
}

function handleSortChange(sortCriteria) {
    console.log(`Tri par: ${sortCriteria}`);

    // Trier les données
    const sortedMedia = sortMedia(originalMediaData, sortCriteria);

    // Réafficher les médias triés
    mediaContainer.innerHTML = '';
    displayMedia(sortedMedia, mediaContainer);

    // Réinitialiser les fonctionnalités dépendantes
    initLikes();
    initMediaLightbox(mediaContainer, sortedMedia);
}