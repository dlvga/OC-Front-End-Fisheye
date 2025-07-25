import Media from "./Media.js";

export default class VideoMedia extends Media {
    constructor({ id, photographerId, title, likes, date, price, video }) {
        super({ id, photographerId, title, likes, date, price});
        this._video = video;
    }
    get video() {
        return `assets/videos/${this._video}`;
    }
}