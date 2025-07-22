import DataService from "./DataService";

export async function getPhotographerMedia(id) {
    const dataService = new DataService();
    await dataService.fetchData();
    const media = dataService.getMediaByPhotographerId(parseInt(id));
    if (!media || media.length === 0) {
        throw new Error("media non trouvé");
    }
    return media;
}