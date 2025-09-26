import {displayError} from "../utils/displayError.js";
import {PhotographerTemplate} from "../templates/PhotographerTemplate.js";

/**
 * Affiche les informations d'un photographe dans le header de sa page
 * Utilise le template dédié pour générer le HTML et gère les erreurs
 * @param {Photographer} photographer - Instance du modèle Photographer à afficher
 * @param {HTMLElement} container - Élément DOM où injecter le contenu du photographe
 */
export function displayPhotographer(photographer, container) {
    // Réinitialisation du container pour éviter les doublons
    container.innerHTML = '';

    if (!photographer) {
        displayError(container, "Aucun photographe à afficher.");
        return;
    }

    container.setAttribute('aria-label', 'Profil du photographe');

    // Génération et injection du header via le template
    const template = new PhotographerTemplate(photographer);
    const photographerHeaderElement = template.renderPhotographerHeader();
    container.appendChild(photographerHeaderElement);
}