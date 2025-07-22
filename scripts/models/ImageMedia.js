import Media from "./Media";

export default class ImageMedia extends Media {
    constructor({ id, photographerId, title, likes, date, price, image }) {
        super({ id, photographerId, title, likes, date, price});
        this._image = image;
    }
}