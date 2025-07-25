import VideoMedia from "../models/VideoMedia.js";
import ImageMedia from "../models/ImageMedia.js";

export default class MediaFactory {

    constructor(media) {
        if (!media) {
            throw new Error("Media data is required to create a MediaFactory instance.");
        } else if (media.image) {
            return  new ImageMedia(media);
        } else if (media.video) {
            return  new VideoMedia(media);
        } else {
            throw new Error("Unsupported media type. Media must be either an image or a video.");
        }
    }
}