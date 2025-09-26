/**
 * Modèle représentant un photographe
 * Contient toutes les informations d'un photographe et les méthodes pour les formater
 */
export default class Photographer {
    /**
     * Constructeur pour créer une instance de photographe
     * @param {Object} photographerData - Données du photographe
     * @param {number} photographerData.id - Identifiant unique du photographe
     * @param {string} photographerData.name - Nom complet du photographe
     * @param {string} photographerData.city - Ville de résidence
     * @param {string} photographerData.country - Pays de résidence
     * @param {string} photographerData.tagline - Slogan/devise du photographe
     * @param {number} photographerData.price - Tarif journalier en euros
     * @param {string} photographerData.portrait - Nom du fichier photo de profil
     */
    constructor({ id, name, city, country, tagline, price, portrait }) {
        this._id = id;
        this._name = name;
        this._city = city;
        this._country = country;
        this._tagline = tagline;
        this._price = price;
        this._portrait = portrait;
    }

    /**
     * Retourne le chemin complet vers la photo de profil
     * @returns {string} Chemin relatif vers l'image dans le dossier assets/photographers/
     */
    getProfilePicture() {
        return `assets/photographers/${this._portrait}`;
    }

    /**
     * Retourne un objet formaté avec toutes les données du photographe
     * Utilisé pour l'affichage dans les templates
     * @returns {Object} Objet contenant les données formatées du photographe
     */
    getProfileData() {
        return {
            id: this._id,
            name: this._name,
            location: `${this._city}, ${this._country}`,
            tagline: this._tagline,
            price: `${this._price}€/jour`,
            profilePicture: this.getProfilePicture()
        };
    }
}