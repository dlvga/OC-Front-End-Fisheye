import {displayError} from '../utils/displayError.js';
import DataService from "./DataService.js";

/**
 * Service pour récupérer tous les photographes
 * Gère les erreurs et affiche un message en cas de problème
 * @param {HTMLElement} container - Conteneur pour afficher les erreurs (optionnel)
 * @returns {Promise<Array>} Promise résolue avec le tableau des photographes
 */
export async function getPhotographers(container) {
    try {
        const dataService = new DataService();
        await dataService.fetchData();
        return dataService.getPhotographers() || [];
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        if (container) {
            displayError(container, "Erreur lors du chargement des photographes.");
        }
        return [];
    }
}

/**
 * Service pour récupérer un photographe spécifique par son ID
 * @param {string|number} id - Identifiant du photographe
 * @returns {Promise<Object>} Promise résolue avec les données du photographe
 * @throws {Error} Lance une erreur si le photographe n'est pas trouvé
 */
export async function getPhotographer(id) {
    const dataService = new DataService();
    await dataService.fetchData();
    const photographer = dataService.getPhotographerById(parseInt(id));

    if (!photographer) {
        throw new Error("Photographe non trouvé");
    }

    return photographer;
}