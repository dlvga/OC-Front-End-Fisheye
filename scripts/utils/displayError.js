// utils/displayError.js
import { createElement } from './domUtils.js';

export function displayError(container, message) {
    // Supprime les anciens messages d'erreur
    container.innerHTML = '';

    // Création de la popup
    const popup = createElement('div', { className: 'error-popup' });

    // Message d'erreur
    const errorMsg = createElement('p', {
        className: 'error-message',
        text: message
    });

    // Bouton de fermeture
    const closeBtn = createElement('button', {
        className: 'error-close-btn',
        text: 'Fermer',
        attrs: { 'aria-label': 'Fermer la fenêtre d’erreur' }
    });
    closeBtn.addEventListener('click', () => {
        popup.remove();
    });

    popup.appendChild(errorMsg);
    popup.appendChild(closeBtn);

    // Ajoute la popup au container
    container.appendChild(popup);
}