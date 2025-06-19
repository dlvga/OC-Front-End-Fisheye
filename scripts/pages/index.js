    async function getPhotographers() {
        // Request with "fetch".
        try {
            const response = await fetch("data/photographers.json");
            const data = await response.json();
            return { photographers: data.photographers };
        } catch (error) {
            console.error("Error retrieving photographers:", error);
            // Empty array in case of error
            return { photographers: [] };
        }
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Get photographers data
        const { photographers } = await getPhotographers();
        await displayData(photographers);
    }
    
    init();
    
