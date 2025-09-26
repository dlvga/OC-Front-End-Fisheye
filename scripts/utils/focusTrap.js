/**
 * Utilitaire générique pour gérer le focus trap dans les modales et lightbox
 * Factorisation des fonctionnalités communes entre contactForm.js et mediaLightboxManager.js
 * Implémente la capture de focus pour l'accessibilité selon les standards ARIA
 */

/**
 * Trouve tous les éléments focusables dans un container donné
 * Utilise une liste exhaustive de sélecteurs pour capturer tous les éléments interactifs
 * @param {HTMLElement} container - L'élément racine où chercher les éléments focusables
 * @returns {HTMLElement[]} Liste ordonnée des éléments focusables trouvés
 */
function getFocusableElements(container) {
    // Sélecteurs CSS pour tous les types d'éléments pouvant recevoir le focus
    const focusableSelectors = [
        'a[href]',                           // Liens avec href défini
        'button:not([disabled])',            // Boutons non désactivés
        'input:not([disabled])',             // Champs input non désactivés
        'textarea:not([disabled])',          // Zones de texte non désactivées
        'select:not([disabled])',            // Listes déroulantes non désactivées
        'video[controls]',                   // Vidéos avec contrôles natifs
        '[tabindex]:not([tabindex="-1"])'    // Éléments avec tabindex positif ou 0
    ];

    // Récupération et conversion en tableau pour faciliter la manipulation
    return Array.from(container.querySelectorAll(focusableSelectors.join(',')));
}

/**
 * Crée un gestionnaire de focus trap pour confiner la navigation clavier dans un container
 * Implémente la navigation cyclique (Tab) et les raccourcis clavier personnalisés
 * @param {HTMLElement} container - L'élément dans lequel confiner le focus
 * @param {Object} options - Options de configuration pour les callbacks
 * @param {Function} options.onEscape - Callback appelé lors de l'appui sur Échappement
 * @param {Function} options.onArrowLeft - Callback optionnel pour flèche gauche (navigation)
 * @param {Function} options.onArrowRight - Callback optionnel pour flèche droite (navigation)
 * @returns {Function} Fonction de nettoyage pour supprimer les event listeners
 */
export function createFocusTrap(container, options = {}) {
    // Extraction des callbacks avec valeurs par défaut
    const {
        onEscape,
        onArrowLeft,
        onArrowRight
    } = options;

    // Identification de tous les éléments focusables dans le container
    const focusableElementsList = getFocusableElements(container);

    // Vérification de la présence d'éléments focusables
    if (!focusableElementsList.length) {
        console.warn('Focus trap: Aucun élément focusable trouvé dans le container');
        return () => {}; // Retourne une fonction de nettoyage vide
    }

    // Références aux éléments de début et fin pour la navigation cyclique
    const firstFocusableElement = focusableElementsList[0];
    const lastFocusableElement = focusableElementsList[focusableElementsList.length - 1];


    /**
     * Gestionnaire principal des événements clavier dans le focus trap
     * Dispatche les actions selon la touche pressée
     * @param {KeyboardEvent} keyboardEvent - Événement clavier capturé
     */
    function handleKeyDown(keyboardEvent) {
        switch (keyboardEvent.key) {
            case 'Tab':
                // Navigation séquentielle (Tab/Shift+Tab) avec bouclage
                handleTabNavigation(keyboardEvent);
                break;

            case 'Escape':
                // Fermeture de la modale/lightbox
                if (onEscape) {
                    keyboardEvent.preventDefault();
                    onEscape();
                }
                break;

            case 'ArrowLeft':
                // Navigation vers l'élément précédent (pour lightbox)
                if (onArrowLeft) {
                    keyboardEvent.preventDefault();
                    onArrowLeft();
                }
                break;

            case 'ArrowRight':
                // Navigation vers l'élément suivant (pour lightbox)
                if (onArrowRight) {
                    keyboardEvent.preventDefault();
                    onArrowRight();
                }
                break;

            // Autres touches : pas d'action spécifique, comportement par défaut
            default:
                break;
        }
    }

    /**
     * Gère la navigation cyclique avec les touches Tab et Shift+Tab
     * Empêche le focus de sortir du container en bouclant sur les éléments de début/fin
     * @param {KeyboardEvent} tabEvent - Événement clavier de type Tab
     */
    function handleTabNavigation(tabEvent) {
        // Vérification de la direction de la navigation
        if (tabEvent.shiftKey) {
            // Navigation arrière (Shift+Tab)
            if (document.activeElement === firstFocusableElement) {
                // Si on est sur le premier élément, boucler vers le dernier
                tabEvent.preventDefault();
                lastFocusableElement.focus();
            }
            // Sinon, laisser le comportement Tab normal se dérouler
        } else {
            // Navigation avant (Tab seul)
            if (document.activeElement === lastFocusableElement) {
                // Si on est sur le dernier élément, boucler vers le premier
                tabEvent.preventDefault();
                firstFocusableElement.focus();
            }
            // Sinon, laisser le comportement Tab normal se dérouler
        }
    }

    // Activation de l'écoute des événements clavier sur tout le document
    document.addEventListener('keydown', handleKeyDown);

    // Retour de la fonction de nettoyage pour désactiver le focus trap
    return function cleanupFocusTrap() {
        document.removeEventListener('keydown', handleKeyDown);
    };
}

/**
 * Utilitaire pour placer le focus sur un élément spécifique avec gestion d'erreur
 * Supporte les sélecteurs CSS ou les éléments DOM directs, avec délai optionnel
 * @param {string|HTMLElement} elementOrSelector - Sélecteur CSS ou élément DOM à focaliser
 * @param {HTMLElement} [contextContainer=document] - Container de recherche pour le sélecteur
 * @param {number} [delayMs=0] - Délai en millisecondes avant de placer le focus
 */
export function focusElement(elementOrSelector, contextContainer = document, delayMs = 0) {
    /**
     * Fonction interne qui effectue réellement la mise en focus
     * Séparée pour pouvoir être appelée avec ou sans délai
     */
    function performFocus() {
        let targetElement;

        // Détermination de l'élément cible selon le type de paramètre
        if (typeof elementOrSelector === 'string') {
            // Sélecteur CSS : recherche dans le container spécifié
            targetElement = contextContainer.querySelector(elementOrSelector);
        } else if (elementOrSelector instanceof HTMLElement) {
            // Élément DOM direct
            targetElement = elementOrSelector;
        } else {
            console.warn('focusElement: Paramètre invalide, doit être un sélecteur ou un HTMLElement');
            return;
        }

        // Vérification de l'existence et de la capacité de focus de l'élément
        if (!targetElement) {
            console.warn('focusElement: Élément non trouvé:', elementOrSelector);
            return;
        }

        if (typeof targetElement.focus !== 'function') {
            console.warn('focusElement: L\'élément ne supporte pas la méthode focus()');
            return;
        }

        // Application effective du focus avec gestion d'erreur
        try {
            targetElement.focus({ preventScroll: true }); // Évite le scroll automatique
        } catch (focusError) {
            console.error('Erreur lors de la mise en focus:', focusError);
        }
    }

    // Exécution immédiate ou différée selon le délai spécifié
    if (delayMs > 0) {
        // Délai utile pour attendre les animations CSS ou la stabilisation DOM
        setTimeout(performFocus, delayMs);
    } else {
        // Exécution immédiate
        performFocus();
    }
}

/**
 * Restaure le focus sur un élément sauvegardé avec gestion des cas d'erreur
 * Utilisé pour remettre le focus sur l'élément d'origine après fermeture de modale
 * @param {HTMLElement|null} previouslyFocusedElement - Élément à refocaliser (peut être null)
 */
export function restoreFocus(previouslyFocusedElement) {
    // Vérification de la validité de l'élément sauvegardé
    if (!previouslyFocusedElement) {
        return;
    }

    // Vérification que l'élément existe toujours dans le DOM
    if (!document.contains(previouslyFocusedElement)) {
        console.warn('restoreFocus: L\'élément sauvegardé n\'existe plus dans le DOM');
        return;
    }

    // Vérification que l'élément supporte la méthode focus
    if (typeof previouslyFocusedElement.focus !== 'function') {
        console.warn('restoreFocus: L\'élément ne peut pas recevoir le focus');
        return;
    }

    // Restauration effective du focus avec gestion d'erreur
    try {
        previouslyFocusedElement.focus({ preventScroll: true });
    } catch (restoreError) {
        console.error('Erreur lors de la restauration du focus:', restoreError);

        // Fallback : focus sur un élément sûr en cas d'échec
        const fallbackElement = document.querySelector('body > header a') ||
            document.getElementById('main') ||
            document.body;

        if (fallbackElement && typeof fallbackElement.focus === 'function') {
            try {
                fallbackElement.focus({ preventScroll: true });
            } catch (fallbackError) {
                console.error('Échec du focus de fallback:', fallbackError);
            }
        }
    }
}