import Media from "./Media.js";

/**
 * Modèle représentant un média de type image
 * Hérite de la classe Media de base et ajoute la gestion spécifique des images
 */
export default class ImageMedia extends Media {
    /**
     * Constructeur pour créer une instance de média image
     * @param {Object} imageData - Données du média image
     * @param {number} imageData.id - Identifiant unique du média
     * @param {number} imageData.photographerId - ID du photographe propriétaire
     * @param {string} imageData.title - Titre de l'image
     * @param {number} imageData.likes - Nombre de likes initial
     * @param {string} imageData.date - Date de création (format YYYY-MM-DD)
     * @param {number} imageData.price - Prix du média en euros
     * @param {string} imageData.image - Nom du fichier image
     */
    constructor({ id, photographerId, title, likes, date, price, image }) {
        // Appel du constructeur parent avec les propriétés communes
        super({ id, photographerId, title, likes, date, price});

        // Stockage du nom de fichier image spécifique
        this._image = image;
    }

    /**
     * Getter qui retourne le chemin complet vers le fichier image
     * Construit l'URL relative depuis le dossier assets/images/
     * @returns {string} Chemin relatif vers l'image
     */
    get image() {
        return `assets/images/${this._image}`;
    }
}