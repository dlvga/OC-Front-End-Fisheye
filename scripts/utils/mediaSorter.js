/**
 * Utilitaire pour trier les médias selon différents critères
 * Propose trois types de tri : popularité, date et titre
 */

/**
 * Trie un tableau de médias selon le critère spécifié
 * @param {Array} mediaArray - Tableau des médias à trier
 * @param {string} sortBy - Critère de tri ('popularity', 'date', 'title')
 * @returns {Array} Nouveau tableau trié (l'original n'est pas modifié)
 */
export function sortMedia(mediaArray, sortBy) {
    // Validation du paramètre d'entrée
    if (!Array.isArray(mediaArray)) {
        console.warn('sortMedia: mediaArray doit être un tableau');
        return [];
    }

    // Création d'une copie pour éviter la mutation du tableau original
    const sortedArray = [...mediaArray];

    switch (sortBy) {
        case 'popularity':
            // Tri par nombre de likes décroissant
            return sortedArray.sort((a, b) => b.likes - a.likes);

        case 'date':
            // Tri par date décroissante (plus récent en premier)
            return sortedArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        case 'title':
            // Tri alphabétique par titre (insensible à la casse)
            return sortedArray.sort((a, b) =>
                a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            );

        default:
            console.warn(`Critère de tri non supporté: ${sortBy}`);
            return sortedArray;
    }
}