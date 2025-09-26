import Photographer from '../models/Photographer.js';
import {PhotographerTemplate} from '../templates/PhotographerTemplate.js';
import {displayError} from '../utils/displayError.js';

/**
 * Affiche la liste des photographes sous forme de cartes sur la page d'accueil
 * Gère l'état vide et utilise les templates pour générer le HTML
 * @param {Array} photographers - Tableau des données brutes des photographes
 * @param {HTMLElement} container - Section DOM où injecter les cartes photographes
 */
export function displayPhotographers(photographers, container) {
    // Réinitialisation complète du container
    container.innerHTML = '';

    // Gestion du cas où aucun photographe n'est disponible
    if (!photographers || photographers.length === 0) {
        displayError(container, "Aucun photographe à afficher.");
        return;
    }

    // Génération d'une carte pour chaque photographe
    photographers.forEach(photographerData => {
        // Création du modèle Photographer avec validation
        const photographerModel = new Photographer(photographerData);

        // Génération du HTML via le template dédié
        const photographerTemplate = new PhotographerTemplate(photographerModel);
        const photographerCard = photographerTemplate.renderPhotographersCard();

        // Injection dans le DOM
        container.appendChild(photographerCard);
    });
}