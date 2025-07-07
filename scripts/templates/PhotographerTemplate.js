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
        const figure = document.createElement('figure');
        figure.className = 'profile-photo-block';

        const photoDiv = createElement('div', { className: 'profile-photo' });

        const img = createElement('img', {
            attrs: {
                src: data.profilePicture,
                alt: `Portrait de ${data.name}`,
                tabindex: '0',
                role: 'img'
            }
        });

        photoDiv.appendChild(img);
        figure.appendChild(photoDiv);

        const figcaption = createElement('figcaption', {
            className: 'sr-only',
            text: name
        });

        figure.appendChild(figcaption);
        return figure;
    }

    _createProfileInfo({ id, name, location, tagline, price }) {
        const infoSection = createElement('section', {
            className: 'profile-info',
            attrs: { 'aria-labelledby': `${id}-name` }
        });

        const nameEl = createElement('h2', {
            text: name,
            attrs: { id: `${id}-name`, tabindex: '0' }
        });

        const locationEl = createElement('p', {
            className: 'location',
            text: location
        });

        const quoteEl = createElement('p', {
            className: 'quote',
            text: tagline
        });

        const rateEl = createElement('p', {
            className: 'rate',
            text: price
        });

        infoSection.append(nameEl, locationEl, quoteEl, rateEl);
        return infoSection;
    }

    render() {
        const data = this.photographer.getProfileData();

        const article = createElement('article', {
            className: 'profile-card',
            attrs: {
                tabindex: '0',
                role: 'region',
                'aria-label': `Profil du photographe ${data.name}`
            }
        });

        article.appendChild(this._createProfilePhoto(data));
        article.appendChild(this._createProfileInfo(data));

        const profileLink = createElement('a', {className: 'profile-link', attrs: { href: `photographer.html?id=${data.id}` } });
        profileLink.appendChild(article);

        return profileLink;
    }
}