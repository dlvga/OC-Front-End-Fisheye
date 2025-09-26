import {createElement} from './domUtils.js';

/**
 * Affiche une popup d'erreur dans un container spécifié
 * Crée une interface utilisateur accessible avec bouton de fermeture
 * @param {HTMLElement} container - Élément DOM où afficher l'erreur
 * @param {string} message - Message d'erreur à afficher à l'utilisateur
 */
export function displayError(container, message) {
    // Nettoyage des anciens messages pour éviter l'accumulation
    container.innerHTML = '';

    // Création du container principal de l'erreur
    const errorPopup = createElement('div', {
        className: 'error-popup',
        attrs: {
            role: 'alert', // ARIA : annonce immédiate aux lecteurs d'écran
            'aria-live': 'assertive'
        }
    });

    // Message d'erreur principal
    const errorMessage = createElement('p', {
        className: 'error-message',
        text: message
    });

    // Bouton de fermeture accessible
    const closeButton = createElement('button', {
        className: 'error-close-btn',
        text: 'Fermer',
        attrs: {
            'aria-label': 'Fermer la fenêtre d\'erreur',
            type: 'button' // Évite la soumission accidentelle de formulaires
        }
    });

    // Gestionnaire de fermeture de la popup
    closeButton.addEventListener('click', () => {
        errorPopup.remove();
    });

    // Assemblage et affichage de la popup
    errorPopup.append(errorMessage, closeButton);
    container.appendChild(errorPopup);

    // Focus automatique sur le bouton fermer pour l'accessibilité
    closeButton.focus();
}