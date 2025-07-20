import { createElement } from "../utils/domUtils.js";
import Photographer from "../models/Photographer.js";

export class PhotographerTemplate {
    constructor(photographer) {
        if (!(photographer instanceof Photographer)) {
            throw new Error("L'objet doit être une instance de Photographer");
        }
        this.photographer = photographer;
    }

    _createProfilePhoto(data) {
        const figure = createElement('figure',
            {
                className: 'profile-photo-block',
            });

        const photoDiv = createElement('div', { className: 'profile-photo' });
        const nameEl = createElement('h2', {
            text: data.name,
            attrs: { id: `${data.id}-name` }
        });

        const img = createElement('img', {
            attrs: {
                src: data.profilePicture,
                //tabindex: '0',
                role: 'img'
            }
        });

        photoDiv.appendChild(img);
        photoDiv.appendChild(nameEl);
        figure.appendChild(photoDiv);

        const figcaption = createElement('figcaption', {
            className: 'sr-only',
            text: name
        });

        figure.appendChild(figcaption);
        const profileLink = createElement('a', {
            className: 'profile-link',
            attrs: {
                href: `photographer.html?id=${data.id}`,
                'aria-label': `Voir le profil de ${data.name}`,
                tabindex: '0'
            } });
        profileLink.appendChild(figure);
        return profileLink;
    }

    _createProfileInfo({ id, name, location, tagline, price }) {
        const infoSection = createElement('section', {
            className: 'profile-info',
            attrs: { 'aria-labelledby': `${id}-name` }
        });

        const locationEl = createElement('p', {
            className: 'location',
            text: location,
            //attrs: { tabindex: '0' }
        });

        const quoteEl = createElement('p', {
            className: 'quote',
            text: tagline,
            // attrs: { tabindex: '0' }
        });

        const rateEl = createElement('p', {
            className: 'rate',
            text: price,
            //attrs: { tabindex: '0' }
        });

        infoSection.append(locationEl, quoteEl, rateEl);
        return infoSection;
    }

    renderPhotographersCard() {
        const data = this.photographer.getProfileData();

        const article = createElement('article', {
            className: 'profile-card',
            attrs: {
                //tabindex: '0',
                role: 'region'
            }
        });

        article.appendChild(this._createProfilePhoto(data));
        article.appendChild(this._createProfileInfo(data));

        return article;
    }

// Photographer header creation

    _createContactButton() {
        const button = createElement('button', {
            className: 'contact_button',
            text: 'Contactez-moi',
            attrs: {
                'aria-label': 'Contact me'
            }
        });

        button.addEventListener('click', () => {
            document.getElementById('contact_modal').style.display = 'block';
        });

        return button;
    }

    _createPhotographerInfo(photographer) {
        const nom = createElement('h1', { className:'photographer-title', text: photographer.name });

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

    _createPhotographerImage(photographer) {
        return createElement('img', {
            className: 'photographer-portrait',
            attrs: {
                src: `${photographer.profilePicture}`,
                alt: `${photographer.name}`
            }
        });
    }

    _closeContactModal() {
        const closeBtn = document.querySelector('#contact_modal img[alt="Fermer fenêtre de contact"]');
        closeBtn.addEventListener('click', () => {
            document.getElementById('contact_modal').style.display = 'none';
        });
    }

    renderPhotographerHeader() {
        const photographer = this.photographer.getProfileData();

        const article = createElement('article', { className: 'photographer-card' });

        const info = this._createPhotographerInfo(photographer);
        const contactButton = this._createContactButton();
        const portrait = this._createPhotographerImage(photographer);

        article.append(info, contactButton, portrait);
        this._closeContactModal();
        
        return article;
    }

}