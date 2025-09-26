/**
 * Classe Media de base
 * Représente un média générique (photo ou vidéo) avec ses propriétés communes
 */
export default class Media {
    /**
     * Constructeur de la classe Media
     * @param {Object} mediaData - Données du média
     * @param {number} mediaData.id - Identifiant unique du média
     * @param {number} mediaData.photographerId - ID du photographe propriétaire
     * @param {string} mediaData.title - Titre du média
     * @param {number} mediaData.likes - Nombre de likes initial
     * @param {string} mediaData.date - Date de création (format YYYY-MM-DD)
     * @param {number} mediaData.price - Prix du média en euros
     */
    constructor({ id, photographerId, title, likes, date, price }) {
        this._id = id;
        this._photographerId = photographerId;
        this._title = title;
        this._likes = likes;
        this._date = date;
        this._price = price;
    }
}