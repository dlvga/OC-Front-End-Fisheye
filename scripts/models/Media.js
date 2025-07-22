export default class Media {
    constructor({ id, photographerId, title, likes, date, price }) {
        this._id = id;
        this._photographerId = photographerId;
        this._title = title;
        this._likes = likes;
        this._date = date;
        this._price = price;
    }
}