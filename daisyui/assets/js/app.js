'use strict';

(function () {
    const API_URL = 'https://dog.ceo/api/';

    async function getBreeds() {
        try {
            const response = await fetch(`${API_URL}breeds/list/all`);
            const res = await response.json();
            return Object.keys(res.message).map(breed => {
                return {
                    value: breed,
                    label: breed.charAt(0).toUpperCase() + breed.slice(1),
                };
            });
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async function getImagesByBreed(breed) {
        try {
            const response = await fetch(`${API_URL}breed/${breed}/images`);
            const res = await response.json();
            return res.message;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    async function getBreedImages() {
        const appContent = document.querySelector('.app-content');
        const breeds = await getBreeds();
        const shuffledBreeds = shuffle(breeds);
        const breed = shuffledBreeds[0].value;
        const images = await getImagesByBreed(breed);

        if (images.length === 0) {
            return getBreedImages();
        }

        const slicedImages = images.slice(0, 10);
        const breedImages = slicedImages.map((image) => {
            return `
                <div class="card bg-base-100 image-full shadow-xl">
                  <figure>
                    <img src="${image}" alt="${breed}">
                 </figure>
                 <div class="card-body">
    <h2 class="card-title">${breed}</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Adopt</button>
    </div>
  </div>
                </div>
            `;
        });
        appContent.innerHTML = breedImages.join('');
    }

    async function init() {
         await getBreedImages(); 
         const randomBreedButton = document.querySelector('.random-breed-btn');
         randomBreedButton.addEventListener('click', getBreedImages);
    }
    init();
})();