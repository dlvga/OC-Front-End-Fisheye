import Media from "./Media.js";

/**
 * Modèle représentant un média vidéo
 * Hérite de la classe Media de base
 */
export default class VideoMedia extends Media {
    /**
     * Constructeur pour créer une instance de média vidéo
     * @param {Object} videoData - Données du média vidéo
     * @param {number} videoData.id - Identifiant unique du média
     * @param {number} videoData.photographerId - ID du photographe propriétaire
     * @param {string} videoData.title - Titre de la vidéo
     * @param {number} videoData.likes - Nombre de likes
     * @param {string} videoData.date - Date de création (format YYYY-MM-DD)
     * @param {number} videoData.price - Prix du média
     * @param {string} videoData.video - Nom du fichier vidéo
     */
    constructor({ id, photographerId, title, likes, date, price, video }) {
        super({ id, photographerId, title, likes, date, price});
        this._video = video;
    }

    /**
     * Getter qui retourne le chemin complet vers le fichier vidéo
     * @returns {string} Chemin relatif vers la vidéo dans le dossier assets/videos/
     */
    get video() {
        return `assets/videos/${this._video}`;
    }
}