import {getPhotographers} from '../services/photographerService.js';
import {displayPhotographers} from '../ui/displayPhotographers.js';

/**
 * Initialisation de la page d'accueil
 * Charge et affiche la liste de tous les photographes disponibles
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Éléments DOM nécessaires pour l'affichage
    const photographersSection = document.querySelector('.photographer_section');
    const errorContainer = document.querySelector('#error-container');

    try {
        // Chargement asynchrone des données photographes
        const photographers = await getPhotographers(errorContainer);

        // Affichage des cartes photographes dans la section dédiée
        displayPhotographers(photographers, photographersSection);

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la page:', error);
        // La gestion d'erreur est déléguée au service getPhotographers
    }
});