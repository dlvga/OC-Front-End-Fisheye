// scripts/pages/photographer.js

import {displayError} from '../utils/displayError.js';
import {getPhotographer} from "../services/photographerService.js";
import {displayPhotographer} from "../ui/displayPhotographer.js";
import Photographer from "../models/Photographer.js";
import {getPhotographerMedia} from "../services/mediaService.js";
import {displayMedia} from "../ui/displayMedia.js";
import {initContactForm} from "../ui/contactForm.js";
import {initMediaSort} from "../ui/mediaSortManager.js";

/**
 * Initialisation de la page photographe
 * Charge et affiche les données du photographe et ses médias
 * Initialise toutes les fonctionnalités interactives
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Récupération de l'ID photographe depuis l'URL
    const photographerId = new URLSearchParams(window.location.search).get('id');

    // Éléments DOM nécessaires
    const photographerSection = document.querySelector('.photographer-header');
    const errorContainer = document.querySelector('#error-container');
    const mediaSection = document.querySelector('.photographer-media');

    // Vérification de la présence de l'ID
    if (!photographerId) {
        displayError(errorContainer, "Aucun ID de photographe fourni.");
        return;
    }

    try {
        // Chargement et affichage des données du photographe
        const photographerData = await getPhotographer(photographerId);
        const photographerModel = new Photographer(photographerData);
        displayPhotographer(photographerModel, photographerSection);

        // Initialisation du formulaire de contact
        initContactForm();

        // Chargement des médias du photographe
        const photographerMedia = await getPhotographerMedia(photographerModel._id);

        if (!photographerMedia || photographerMedia.length === 0) {
            displayError(errorContainer, "Aucun média trouvé pour ce photographe.");
            return;
        }

        // Affichage du tarif dans les statistiques
        document.getElementById('photographer-price').textContent = photographerModel._price;

        // Affichage initial des médias
        displayMedia(photographerMedia, mediaSection);

        // Initialisation du système de tri (gère aussi l'affichage initial trié)
        initMediaSort(photographerMedia, mediaSection);

    } catch (error) {
        console.error("Erreur lors de la récupération du photographe :", error);
        displayError(errorContainer, error);
    }
});