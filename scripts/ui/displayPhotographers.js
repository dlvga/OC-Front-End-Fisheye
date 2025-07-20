// ui/displayPhotographers.js
import Photographer from '../models/Photographer.js';
import { PhotographerTemplate } from '../templates/PhotographerTemplate.js';
import { displayError } from '../utils/displayError.js';

export function displayPhotographers(photographers, container) {
    container.innerHTML = '';
    if (photographers.length === 0) {
        displayError(container, "Aucun photographe à afficher.");
        return;
    }
    photographers.forEach(data => {
        const photographer = new Photographer(data);
        const template = new PhotographerTemplate(photographer);
        const card = template.renderPhotographersCard();
        container.appendChild(card);
    });
}