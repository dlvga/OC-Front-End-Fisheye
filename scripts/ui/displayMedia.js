import {displayError} from "../utils/displayError.js";
import MediaFactory from "../factories/MediaFactory.js";
import {MediaTemplate} from "../templates/MediaTemplate.js";
import {initLikes} from "./mediaLikesManager.js";
import {initMediaLightbox} from "./mediaLightboxManager.js";

export function displayMedia(photographerMedia, container) {
    if (photographerMedia.length === 0) {
        displayError(container, "Aucun media à afficher.");
        return;
    }

    photographerMedia.forEach((media) => {
        const mediaModel = new MediaFactory(media);
        const template = new MediaTemplate(mediaModel);
        const card = template._createMediaCard();
        container.appendChild(card);
    });

    // Initialiser les likes après l'affichage des médias
    initLikes();

    // Initialiser la lightbox pour les médias
    initMediaLightbox(container, photographerMedia);
}