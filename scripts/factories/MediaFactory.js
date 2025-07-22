import VideoMedia from "../models/VideoMedia";
import ImageMedia from "../models/ImageMedia";

export default class MediaFactory {

    _media = null; // Initialiser à null empêche l'inférence restrictive
    /**
     * Factory method to create a media instance based on the provided media data.
     * @param {Object} media - The media data containing either an image or video.
     * @throws {Error} If the media type is unsupported or if no media data is provided.
     */
    constructor(media) {
        if (!media) {
            throw new Error("Media data is required to create a MediaFactory instance.");
        } else if (media._image) {
            this._media = new ImageMedia(media);
        } else if (media._video) {
            this._media = new VideoMedia(media);
        } else {
            throw new Error("Unsupported media type. Media must be either an image or a video.");
        }
    }
}