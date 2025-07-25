import { createElement } from "../utils/domUtils.js";
import VideoMedia from "../models/VideoMedia.js";
import ImageMedia from "../models/ImageMedia.js";

export class MediaTemplate {
    constructor(media) {
        if (!(media instanceof VideoMedia || media instanceof ImageMedia)) {
            throw new Error("L'objet doit être une instance de Media");
        }
        this.media = media;
    }

    _createMediaCard() {
        const article = createElement('article', {
            className: 'media-card',
            attrs: {
                'data-id': this.media._id
            }
        });

        // Wrapper
        const mediaLink = createElement('a', {
            className: 'media-link',
            attrs: {
                href: '#',
                role: 'link',
                'aria-label': `${this.media._title}, Ouvrir en plein écran`
            }
        });

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
                    ariaLabel: `${this.media._title}`
                }
            });
        }

        mediaLink.appendChild(mediaEl);

        // Title + likes
        const footer = createElement('footer', { className: 'media-footer' });

        const title = createElement('h2', {
            text: this.media._title
        });

        const likesWrapper = createElement('div', { className: 'likes' });
        const likesCount = createElement('span', {
            text: this.media._likes,
            attrs: {
                class: 'likes-count',
                'aria-label': 'nombre de likes'
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
}