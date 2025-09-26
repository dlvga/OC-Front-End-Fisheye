import VideoMedia from "../models/VideoMedia.js";
import ImageMedia from "../models/ImageMedia.js";

/**
 * Factory Pattern pour créer des instances de média
 * Détermine automatiquement le type de média (image ou vidéo) et retourne l'instance appropriée
 */
export default class MediaFactory {
    /**
     * Constructeur qui agit comme une factory
     * Analyse les données et retourne une instance du bon type de média
     * @param {Object} media - Données du média à analyser
     * @param {string} [media.image] - Nom du fichier image (si c'est une image)
     * @param {string} [media.video] - Nom du fichier vidéo (si c'est une vidéo)
     * @returns {ImageMedia|VideoMedia} Instance du média approprié
     * @throws {Error} Lance une erreur si les données sont manquantes ou le type non supporté
     */
    constructor(media) {
        if (!media) {
            throw new Error("Media data is required to create a MediaFactory instance.");
        } else if (media.image) {
            // Retourne une instance ImageMedia si le champ image existe
            return new ImageMedia(media);
        } else if (media.video) {
            // Retourne une instance VideoMedia si le champ video existe
            return new VideoMedia(media);
        } else {
            throw new Error("Unsupported media type. Media must be either an image or a video.");
        }
    }
}