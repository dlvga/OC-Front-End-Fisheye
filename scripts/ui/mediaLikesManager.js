/**
 * Gestionnaire du système de likes pour les médias
 * Gère l'interaction utilisateur, l'accessibilité et la mise à jour du compteur global
 */

/**
 * Initialise le système de likes sur tous les médias affichés
 * Configure l'accessibilité et les event listeners pour chaque cœur de like
 */
export function initLikes() {
    // Sélection de tous les éléments de l'interface de likes
    const heartIcons = document.querySelectorAll('.media-card .likes img');
    const likeCountSpans = document.querySelectorAll('.media-card .likes-count');

    // Map pour associer rapidement chaque ID de média à son compteur
    const mediaIdToCounterElement = new Map();
    likeCountSpans.forEach(counterSpan => {
        // Récupération de l'ID depuis l'attribut data-id de la carte parente
        const mediaCardId = counterSpan.closest('.media-card')?.dataset.id;
        if (mediaCardId) {
            mediaIdToCounterElement.set(String(mediaCardId), counterSpan);
        }
    });

    // Map pour mémoriser l'état (liké/non-liké) de chaque média
    const likedMediaStates = new Map();

    // Configuration de chaque icône de cœur
    heartIcons.forEach(heartIcon => {
        const mediaCardId = heartIcon.closest('.media-card')?.dataset.id;
        if (!mediaCardId) return;

        // Attributs d'accessibilité pour faire du cœur un bouton utilisable au clavier
        heartIcon.setAttribute('tabindex', '0');
        heartIcon.setAttribute('role', 'button');
        heartIcon.setAttribute('aria-label', 'Ajouter ou retirer un like');
        heartIcon.setAttribute('aria-pressed', 'false'); // État initial : non-liké

        // Fonction de basculement du like pour ce média spécifique
        const toggleLikeForThisMedia = () => toggleLikeById(String(mediaCardId), heartIcon);

        // Event listeners pour les interactions souris et clavier
        heartIcon.addEventListener('click', toggleLikeForThisMedia);
        heartIcon.addEventListener('keydown', keyboardEvent => {
            // Activation avec Entrée ou Espace (standard accessibilité)
            if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                keyboardEvent.preventDefault();
                toggleLikeForThisMedia();
            }
        });
    });

    /**
     * Bascule l'état de like d'un média et met à jour l'affichage
     * @param {string} mediaId - ID du média à modifier
     * @param {HTMLElement} heartElement - Élément cœur correspondant (pour aria-pressed)
     */
    function toggleLikeById(mediaId, heartElement) {
        const counterElement = mediaIdToCounterElement.get(mediaId);
        if (!counterElement) return;

        // Lecture de la valeur actuelle du compteur
        const currentLikeCount = parseInt(counterElement.textContent, 10) || 0;

        // Vérification de l'état actuel (liké ou non)
        const isCurrentlyLiked = likedMediaStates.get(mediaId) === true;

        // Calcul de la nouvelle valeur (incrémentation ou décrémentation)
        const newLikeCount = isCurrentlyLiked ? currentLikeCount - 1 : currentLikeCount + 1;

        // Mise à jour de l'affichage du compteur
        counterElement.textContent = String(newLikeCount);

        // Inversion de l'état mémorisé
        likedMediaStates.set(mediaId, !isCurrentlyLiked);

        // Mise à jour de l'attribut aria-pressed pour l'accessibilité
        if (heartElement) {
            heartElement.setAttribute('aria-pressed', String(!isCurrentlyLiked));
        }

        // Recalcul et mise à jour du total global
        updateTotalLikes();
    }

    /**
     * Recalcule et met à jour le compteur total de likes affiché
     * Parcourt tous les compteurs individuels pour sommer les valeurs
     */
    function updateTotalLikes() {
        let totalLikesSum = 0;

        // Sommation de tous les compteurs individuels
        mediaIdToCounterElement.forEach(counterSpan => {
            const individualCount = parseInt(counterSpan.textContent, 10) || 0;
            totalLikesSum += individualCount;
        });

        // Mise à jour de l'affichage du total dans l'élément dédié
        const totalLikesDisplay = document.getElementById('total-likes');
        if (totalLikesDisplay) {
            totalLikesDisplay.textContent = String(totalLikesSum);
        }
    }

    // Calcul initial du total au chargement de la page
    updateTotalLikes();
}