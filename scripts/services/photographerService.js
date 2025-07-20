// services/photographerService.js
import { displayError } from '../utils/displayError.js';
import DataService from "./DataService.js";

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

export async function getPhotographer(id) {
    const dataService = new DataService();
    await dataService.fetchData();
    const photographer = dataService.getPhotographerById(parseInt(id));
    if (!photographer) {
        throw new Error("Photographe non trouvé");
    }
    return photographer;
}