import {createElement} from "../utils/domUtils.js";
import Photographer from "../models/Photographer.js";

/**
 * Template pour générer les vues HTML d'un photographe
 * Gère l'affichage de la carte photographe et du header de profil
 */
export class PhotographerTemplate {
    /**
     * Constructeur du template photographe
     * @param {Photographer} photographer - Instance de photographe à afficher
     * @throws {Error} Lance une erreur si l'objet n'est pas une instance de Photographer
     */
    constructor(photographer) {
        if (!(photographer instanceof Photographer)) {
            throw new Error("L'objet doit être une instance de Photographer");
        }
        this.photographer = photographer;
    }

    /**
     * Crée le bloc photo avec nom pour la carte photographe
     * @private
     * @param {Object} data - Données formatées du photographe
     * @returns {HTMLElement} Lien contenant la photo et le nom
     */
    _createProfilePhoto(data) {
        const figure = createElement('figure',
            {
                className: 'profile-photo-block',
            });

        const photoDiv = createElement('div', { className: 'profile-photo' });

        // Titre avec ID unique pour l'accessibilité
        const nameEl = createElement('h2', {
            text: data.name,
            attrs: { id: `${data.id}-name` }
        });

        // Image de profil avec attributs d'accessibilité
        const img = createElement('img', {
            attrs: {
                src: data.profilePicture,
                alt: data.name,
                role: 'img'
            }
        });

        photoDiv.appendChild(img);
        photoDiv.appendChild(nameEl);
        figure.appendChild(photoDiv);

        // Figcaption cachée pour les lecteurs d'écran
        const figcaption = createElement('figcaption', {
            className: 'sr-only',
            text: data.name
        });

        figure.appendChild(figcaption);

        // Lien vers la page du photographe
        const profileLink = createElement('a', {
            className: 'profile-link',
            attrs: {
                href: `photographer.html?id=${data.id}`,
                'aria-label': `Voir le profil de ${data.name}`,
                tabindex: '0'
            }
        });

        profileLink.appendChild(figure);
        return profileLink;
    }

    /**
     * Crée la section d'informations du photographe (localisation, slogan, tarif)
     * @private
     * @param {Object} data - Données du photographe
     * @param {number} data.id - ID pour lier à l'en-tête
     * @param {string} data.location - Localisation formatée
     * @param {string} data.tagline - Slogan du photographe
     * @param {string} data.price - Prix formaté
     * @returns {HTMLElement} Section contenant les informations
     */
    _createProfileInfo({ id, location, tagline, price }) {
        const infoSection = createElement('section', {
            className: 'profile-info',
            attrs: { 'aria-labelledby': `${id}-name` }
        });

        const locationEl = createElement('p', {
            className: 'location',
            text: location,
        });

        const quoteEl = createElement('p', {
            className: 'quote',
            text: tagline,
        });

        const rateEl = createElement('p', {
            className: 'rate',
            text: price,
        });

        infoSection.append(locationEl, quoteEl, rateEl);
        return infoSection;
    }

    /**
     * Génère la carte photographe complète pour la page d'accueil
     * @returns {HTMLElement} Article contenant la carte photographe
     */
    renderPhotographersCard() {
        const data = this.photographer.getProfileData();

        const article = createElement('article', {
            className: 'profile-card',
            attrs: {
                role: 'region'
            }
        });

        article.appendChild(this._createProfilePhoto(data));
        article.appendChild(this._createProfileInfo(data));

        return article;
    }

    /**
     * Crée le bouton de contact pour le header
     * @private
     * @returns {HTMLElement} Bouton de contact
     */
    _createContactButton() {
        return createElement('button', {
            className: 'contact_button',
            text: 'Contactez-moi',
            attrs: {
                'aria-label': 'Contact me',
                id: 'contact-button'
            }
        });
    }

    /**
     * Crée le bloc d'informations pour le header de la page photographe
     * @private
     * @param {Object} photographer - Données formatées du photographe
     * @returns {HTMLElement} Container avec nom, localisation et slogan
     */
    _createPhotographerInfo(photographer) {
        const nom = createElement('h2', {
            className:'photographer-title',
            text: photographer.name
        });

        const localisation = createElement('p', {
            className: 'photographer-location',
            text: `${photographer.location}`
        });

        const slogan = createElement('p', {
            className: 'photographer-tagline',
            text: photographer.tagline
        });

        const container = createElement('div', { className: 'photographer-info' });
        container.append(nom, localisation, slogan);
        return container;
    }

    /**
     * Crée l'image de profil pour le header
     * @private
     * @param {Object} photographer - Données du photographe
     * @returns {HTMLElement} Image de profil
     */
    _createPhotographerImage(photographer) {
        return createElement('img', {
            className: 'photographer-portrait',
            attrs: {
                src: `${photographer.profilePicture}`,
                alt: `${photographer.name}`
            }
        });
    }

    /**
     * Génère le header complet pour la page photographe
     * @returns {HTMLElement} Article contenant le header du photographe
     */
    renderPhotographerHeader() {
        const photographer = this.photographer.getProfileData();

        const article = createElement('article', { className: 'photographer-card' });

        const info = this._createPhotographerInfo(photographer);
        const contactButton = this._createContactButton();
        const portrait = this._createPhotographerImage(photographer);

        article.append(info, contactButton, portrait);

        return article;
    }
}