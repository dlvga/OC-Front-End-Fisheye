import {displayError} from "../utils/displayError.js";
import MediaFactory from "../factories/MediaFactory.js";
import {MediaTemplate} from "../templates/MediaTemplate.js";

/**
 * Affiche une collection de médias dans le container spécifié
 * Utilise le Factory Pattern et les templates pour générer le HTML
 * @param {Array} photographerMedia - Tableau des données brutes des médias
 * @param {HTMLElement} container - Élément DOM où injecter les cartes médias
 */
export function displayMedia(photographerMedia, container) {
    // Vérification de la présence de médias à afficher
    if (!photographerMedia || photographerMedia.length === 0) {
        displayError(container, "Aucun media à afficher.");
        return;
    }

    // Génération et injection de chaque carte média
    photographerMedia.forEach((mediaData) => {
        // Factory Pattern : création automatique du bon type de média (Image/Video)
        const mediaModel = new MediaFactory(mediaData);

        // Template Pattern : génération du HTML via le template dédié
        const mediaTemplate = new MediaTemplate(mediaModel);
        const mediaCard = mediaTemplate.renderMediaCard();

        // Injection dans le DOM
        container.appendChild(mediaCard);
    });
}