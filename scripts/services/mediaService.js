import DataService from "./DataService.js";

/**
 * Service pour récupérer les médias d'un photographe spécifique
 * @param {string|number} id - Identifiant du photographe
 * @returns {Promise<Array>} Promise résolue avec le tableau des médias du photographe
 * @throws {Error} Lance une erreur si aucun média n'est trouvé
 */
export async function getPhotographerMedia(id) {
    const dataService = new DataService();
    await dataService.fetchData();
    const media = dataService.getMediaByPhotographerId(parseInt(id));

    if (!media || media.length === 0) {
        throw new Error("media non trouvé");
    }

    return media;
}