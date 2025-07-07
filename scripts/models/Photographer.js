export default class Photographer {
    constructor({ id, name, city, country, tagline, price, portrait }) {
        this._id = id;
        this._name = name;
        this._city = city;
        this._country = country;
        this._tagline = tagline;
        this._price = price;
        this._portrait = portrait;
    }

    getProfilePicture() {
        return `assets/photographers/${this._portrait}`;
    }

    getProfileData() {
        return {
            id: this._id,
            name: this._name,
            location: `${this._city}, ${this._country}`,
            tagline: this._tagline,
            price: `${this._price}€/jour`,
            profilePicture: this.getProfilePicture()
        };
    }
}