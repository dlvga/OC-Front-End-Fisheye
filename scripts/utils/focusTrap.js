// scripts/utils/focusTrap.js

/**
 * Utilitaire générique pour gérer le focus trap dans les modales et lightbox
 * Factorisation des fonctionnalités communes entre contactForm.js et mediaLightboxManager.js
 */

/**
 * Trouve tous les éléments focusables dans un container
 * @param {HTMLElement} container - L'élément racine où chercher
 * @returns {HTMLElement[]} - Liste des éléments focusables
 */
function getFocusableElements(container) {
    const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'video[controls]',
        '[tabindex]:not([tabindex="-1"])'
    ];

    return Array.from(container.querySelectorAll(selectors.join(',')));
}

/**
 * Créé un gestionnaire de focus trap pour un container donné
 * @param {HTMLElement} container - L'élément dans lequel confiner le focus
 * @param {Object} options - Options de configuration
 * @param {Function} options.onEscape - Callback appelé lors de l'appui sur Échap
 * @param {Function} options.onArrowLeft - Callback optionnel pour flèche gauche
 * @param {Function} options.onArrowRight - Callback optionnel pour flèche droite
 * @returns {Function} - Fonction de nettoyage pour supprimer les event listeners
 */
export function createFocusTrap(container, options = {}) {
    const {
        onEscape,
        onArrowLeft,
        onArrowRight
    } = options;

    const focusableElements = getFocusableElements(container);

    if (!focusableElements.length) {
        console.warn('Aucun élément focusable trouvé dans le container');
        return () => {}; // Fonction de nettoyage vide
    }

    const firstElement = focusableElements[0];
    console.log("Focusable elements:", focusableElements);
    const lastElement = focusableElements[focusableElements.length - 1];

    /**
     * Gestionnaire principal des événements clavier
     * @param {KeyboardEvent} e
     */
    function handleKeyDown(e) {
        switch (e.key) {
            case 'Tab':
                handleTabNavigation(e);
                break;
            case 'Escape':
                if (onEscape) {
                    e.preventDefault();
                    onEscape();
                }
                break;
            case 'ArrowLeft':
                if (onArrowLeft) {
                    e.preventDefault();
                    onArrowLeft();
                }
                break;
            case 'ArrowRight':
                if (onArrowRight) {
                    e.preventDefault();
                    onArrowRight();
                }
                break;
        }
    }

    /**
     * Gère la navigation cyclique avec Tab/Shift+Tab
     * @param {KeyboardEvent} e
     */
    function handleTabNavigation(e) {
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // Attacher l'event listener
    document.addEventListener('keydown', handleKeyDown);

    // Retourner la fonction de nettoyage
    return function cleanup() {
        document.removeEventListener('keydown', handleKeyDown);
    };
}

/**
 * Utilitaire pour donner le focus au premier élément focusable d'un container
 * @param {HTMLElement} container - Container dans lequel chercher
 * @param {number} delay - Délai optionnel avant de donner le focus (pour les transitions)
 */
export function focusFirstElement(container, delay = 0) {
    const focusableElements = getFocusableElements(container);

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];

    if (delay > 0) {
        setTimeout(() => {
            if (firstElement && document.contains(firstElement)) {
                firstElement.focus();
            }
        }, delay);
    } else {
        firstElement.focus();
    }
}

/**
 * Utilitaire pour donner le focus à un élément spécifique
 * @param {HTMLElement|string} target - Élément ou sélecteur CSS de l'élément à focuser
 * @param {HTMLElement} [container] - Container de recherche (optionnel, par défaut document)
 * @param {number} [delay=0] - Délai optionnel avant de donner le focus
 */
export function focusElement(target, container = document, delay = 0) {
    let element;

    if (typeof target === 'string') {
        // Si c'est un sélecteur CSS
        element = container.querySelector(target);
    } else if (target instanceof HTMLElement) {
        // Si c'est déjà un élément
        element = target;
    } else {
        console.warn('focusElement: target doit être un HTMLElement ou un sélecteur CSS');
        return;
    }

    if (!element) {
        console.warn('focusElement: élément non trouvé');
        return;
    }

    if (!document.contains(element)) {
        console.warn('focusElement: élément non présent dans le DOM');
        return;
    }

    const applyFocus = () => {
        try {
            element.focus();
        } catch (error) {
            console.warn('focusElement: erreur lors du focus', error);
        }
    };

    if (delay > 0) {
        setTimeout(applyFocus, delay);
    } else {
        applyFocus();
    }
}

/**
 * Gestionnaire de focus pour restaurer le focus précédent
 * @param {HTMLElement} elementToFocus - Élément qui doit retrouver le focus
 */
export function restoreFocus(elementToFocus) {
    if (elementToFocus && document.contains(elementToFocus)) {
        elementToFocus.focus();
    }
}
