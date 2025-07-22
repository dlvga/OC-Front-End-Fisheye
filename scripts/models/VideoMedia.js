import Media from "./Media";

export default class VideoMedia extends Media {
    constructor({ id, photographerId, title, likes, date, price, video }) {
        super({ id, photographerId, title, likes, date, price});
        this._video = video;
    }
}