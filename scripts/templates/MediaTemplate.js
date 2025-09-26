import {createElement} from "../utils/domUtils.js";
import VideoMedia from "../models/VideoMedia.js";
import ImageMedia from "../models/ImageMedia.js";

/**
 * Template pour générer le HTML d'une carte média
 * Gère l'affichage des images et vidéos avec leurs métadonnées
 */
export class MediaTemplate {
    /**
     * Constructeur du template média
     * @param {ImageMedia|VideoMedia} media - Instance de média à afficher
     * @throws {Error} Lance une erreur si l'objet n'est pas une instance valide de Media
     */
    constructor(media) {
        if (!(media instanceof VideoMedia || media instanceof ImageMedia)) {
            throw new Error("L'objet doit être une instance de Media");
        }
        this.media = media;
    }

    /**
     * Méthode privée pour créer la structure HTML de la carte média
     * Génère l'élément média (img ou video), le lien cliquable et les métadonnées
     * @private
     * @returns {HTMLElement} Article contenant la carte média complète
     */
    #createMediaCard() {
        // Container principal de la carte
        const article = createElement('article', {
            className: 'media-card',
            attrs: {
                'data-id': this.media._id
            }
        });

        // Lien pour ouvrir la lightbox
        const mediaLink = createElement('a', {
            className: 'media-link',
            attrs: {
                href: '#',
                'aria-label': `${this.media._title}, Ouvrir en plein écran`
            }
        });

        // Création de l'élément média (image ou vidéo)
        let mediaEl;
        if (this.media._image) {
            mediaEl = createElement('img', {
                className: 'media-preview',
                attrs: {
                    src: this.media.image,
                    alt: `${this.media._title}`
                }
            });
        } else {
            mediaEl = createElement('video', {
                className: 'media-preview',
                attrs: {
                    src: this.media.video,
                    'aria-label': `${this.media._title}`
                }
            });
        }

        mediaLink.appendChild(mediaEl);

        // Footer avec titre et système de likes
        const footer = createElement('footer', { className: 'media-footer' });

        const title = createElement('h2', {
            text: this.media._title
        });

        // Container des likes avec compteur et icône
        const likesWrapper = createElement('div', { className: 'likes' });
        const likesCount = createElement('span', {
            text: this.media._likes,
            attrs: {
                class: 'likes-count',
                'data-id': this.media._id // Mapping par ID pour la gestion des likes
            }
        });

        const heartIcon = createElement('img', {
            attrs: {
                src: 'assets/icons/likes.svg',
                alt: 'likes'
            }
        });

        likesWrapper.append(likesCount, heartIcon);
        footer.append(title, likesWrapper);
        article.append(mediaLink, footer);

        return article;
    }

    /**
     * Méthode publique pour générer la carte média
     * @returns {HTMLElement} Element HTML de la carte média
     */
    renderMediaCard() {
        return this.#createMediaCard();
    }
}