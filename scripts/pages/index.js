// scripts/pages/index.js
import { getPhotographers } from '../services/photographerService.js';
import { displayPhotographers } from '../ui/displayPhotographers.js';

document.addEventListener('DOMContentLoaded', async () => {
    const photographersSection = document.querySelector('.photographer_section');
    const errorContainer = document.querySelector('#error-container');
    const photographers = await getPhotographers(errorContainer);
    displayPhotographers(photographers, photographersSection);
});
