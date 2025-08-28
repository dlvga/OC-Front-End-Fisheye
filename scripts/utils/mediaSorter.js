/**
 * Utilitaire pour trier les médias selon différents critères
 */

/**
 * Trie un tableau de médias selon le critère spécifié
 * @param {Array} mediaArray - Tableau des médias à trier
 * @param {string} sortBy - Critère de tri ('popularity', 'date', 'title')
 * @returns {Array} - Tableau trié
 */
export function sortMedia(mediaArray, sortBy) {
    if (!Array.isArray(mediaArray)) {
        console.warn('sortMedia: mediaArray doit être un tableau');
        return [];
    }

    const sortedArray = [...mediaArray];

    switch (sortBy) {
        case 'popularity':
            return sortedArray.sort((a, b) => b.likes - a.likes);

        case 'date':
            return sortedArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        case 'title':
            return sortedArray.sort((a, b) =>
                a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            );

        default:
            console.warn(`Critère de tri non supporté: ${sortBy}`);
            return sortedArray;
    }
}

/**
 * Retourne les options de tri disponibles
 */
export function getSortOptions() {
    return [
        { value: 'popularity', label: 'Popularité' },
        { value: 'date', label: 'Date' },
        { value: 'title', label: 'Titre' }
    ];
}