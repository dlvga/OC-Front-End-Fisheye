// scripts/services/DataService.js
export default class DataService {
    constructor() {
        if (DataService.instance) {
            return DataService.instance;
        }

        this._photographers = [];
        this._media = [];
        this._dataLoaded = false;

        DataService.instance = this;
    }

    async fetchData() {
        if (this._dataLoaded) return;

        try {
            const response = await fetch("https://raw.githubusercontent.com/dlvga/OC-Front-End-Fisheye/refs/heads/main/data/photographers.json");
            const data = await response.json();

            this._photographers = data.photographers;
            this._media = data.media;
            this._dataLoaded = true;
        } catch (error) {
            throw error;
        }
    }

    getPhotographers() {
        return this._photographers;
    }

    // TODO : handle case where photographer is not found
    getPhotographerById(id) {
        return this._photographers.find(photographer => photographer.id === id);
    }

    getMediaByPhotographerId(photographerId) {
        return this._media.filter(media => media.photographerId === photographerId);
    }
}