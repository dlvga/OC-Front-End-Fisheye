/**
 * Utilitaire pour créer des éléments DOM de façon programmatique
 * Centralise la création d'éléments avec attributs et contenu
 * @param {string} tagName - Nom de la balise HTML à créer (ex: 'div', 'button')
 * @param {Object} options - Configuration de l'élément
 * @param {string} [options.className=''] - Classes CSS à appliquer
 * @param {string} [options.text=''] - Contenu textuel de l'élément
 * @param {Object} [options.attrs={}] - Attributs HTML à définir (clé-valeur)
 * @returns {HTMLElement} Élément DOM créé et configuré
 */
export function createElement(tagName, { className = '', text = '', attrs = {} } = {}) {
    // Création de l'élément de base
    const element = document.createElement(tagName);

    // Application de la classe CSS si spécifiée
    if (className) {
        element.className = className;
    }

    // Définition du contenu textuel si fourni
    if (text) {
        element.textContent = text;
    }

    // Application de tous les attributs HTML personnalisés
    for (const [attributeName, attributeValue] of Object.entries(attrs)) {
        element.setAttribute(attributeName, attributeValue);
    }

    return element;
}