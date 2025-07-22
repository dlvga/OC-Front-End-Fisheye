import {displayError} from "../utils/displayError.js";

export function displayMedia(media, container) {
    container.innerHTML = '';
    if (photographer.length === 0) {
        displayError(container, "Aucun photographe à afficher.");
        return;
    }
    const section = document.querySelector('.photographer-header');
    section.setAttribute('aria-label', 'Profil du photographe');
    const template = new PhotographerTemplate(photographer);
    const article = template.renderPhotographerHeader();
    container.appendChild(article);
}