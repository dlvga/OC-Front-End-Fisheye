/**
 * Service singleton pour la récupération et la gestion des données
 * Charge les photographes et médias depuis l'API JSON et fournit des méthodes d'accès
 */
export default class DataService {
    constructor() {
        // Pattern Singleton : retourne l'instance existante si elle existe
        if (DataService.instance) {
            return DataService.instance;
        }

        // Initialisation des propriétés de données
        this._photographers = [];
        this._media = [];
        this._dataLoaded = false;

        // Stockage de l'instance pour le pattern Singleton
        DataService.instance = this;
    }

    /**
     * Charge les données depuis l'API de façon asynchrone
     * Ne recharge pas si les données sont déjà présentes (cache)
     * @throws {Error} Lance une erreur si la requête réseau échoue
     */
    async fetchData() {
        // Éviter les rechargements inutiles
        if (this._dataLoaded) return;

        try {
            const response = await fetch("https://raw.githubusercontent.com/dlvga/OC-Front-End-Fisheye/refs/heads/main/data/photographers.json");

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Stockage des données avec validation basique
            this._photographers = data.photographers || [];
            this._media = data.media || [];
            this._dataLoaded = true;

        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            throw new Error('Impossible de charger les données des photographes');
        }
    }

    /**
     * Retourne la liste complète des photographes
     * @returns {Array} Tableau des objets photographes
     */
    getPhotographers() {
        return this._photographers;
    }

    /**
     * Recherche un photographe par son identifiant
     * @param {number} id - Identifiant unique du photographe
     * @returns {Object|undefined} Objet photographe trouvé ou undefined
     */
    getPhotographerById(id) {
        return this._photographers.find(photographer => photographer.id === id);
    }

    /**
     * Filtre les médias appartenant à un photographe spécifique
     * @param {number} photographerId - Identifiant du photographe propriétaire
     * @returns {Array} Tableau des médias du photographe
     */
    getMediaByPhotographerId(photographerId) {
        return this._media.filter(media => media.photographerId === photographerId);
    }
}