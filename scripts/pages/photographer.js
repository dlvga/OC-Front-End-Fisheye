// scripts/pages/photographer.js

import { displayError } from '../utils/displayError.js';
import {getPhotographer} from "../services/photographerService.js";
import {displayPhotographer} from "../ui/displayPhotographer.js";
import Photographer from "../models/Photographer.js";
import {getPhotographerMedia} from "../services/mediaService.js";
import {displayMedia} from "../ui/displayMedia.js";

document.addEventListener('DOMContentLoaded', async () => {
    const photographerId = new URLSearchParams(window.location.search).get('id');
    const photographerSection = document.querySelector('.photographer-header');
    const errorContainer = document.querySelector('#error-container');
    const mediaSection = document.querySelector('.photographer-media');

    if (!photographerId) {
        displayError(errorContainer, "Aucun ID de photographe fourni.");
        return;
    }

    try {
        const photographerData = await getPhotographer(photographerId);
        const photographerModel = new Photographer(photographerData);
        displayPhotographer(photographerModel, photographerSection);
        const photographerMedia = await getPhotographerMedia(photographerModel._id);
        if (!photographerMedia || photographerMedia.length === 0) {
            displayError(errorContainer, "Aucun média trouvé pour ce photographe.");
            return;
        }
        // Display the photographer's media
        displayMedia(photographerMedia, mediaSection);
    } catch (error) {
        console.error("Erreur lors de la récupération du photographe :", error);
        displayError(errorContainer, error);
    }
});
