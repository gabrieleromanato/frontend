'use strict';

import { faker } from 'https://esm.sh/@faker-js/faker';

(function () {
  const items = [];

  function insertGridItems(target = null, total = 12) {
    if (!target) {
      return;
    }
    const gridLoader = document.getElementById('grid-loader');
    const watchLoader = setInterval(() => {
      if (document.querySelectorAll('.img-loaded').length === total) {
        gridLoader.classList.add('loaded');
        clearInterval(watchLoader);
      }
    }, 200);
    for (let i = 0; i < total; i++) {
      let src = faker.image.urlPicsumPhotos({
        width: 640,
        height: 400,
        blur: 0,
      });
      let city = faker.location.city();
      let continent = faker.location.continent();
      let country = faker.location.country();
      let figure = document.createElement('figure');
      figure.className = 'grid-item';
      figure.dataset.city = city;
      figure.dataset.continent = continent;
      figure.dataset.country = country;
      let img = new Image();
      img.src = src;
      img.addEventListener('load', () => {
        if (img.complete) {
          figure.classList.add('img-loaded');
          figure.innerHTML = `<img src="${src}">`;
          target.appendChild(figure);
        }
      });

      items.push({ city, continent, country });
    }
  }

  function createFilters(form) {
    if (items.length === 0) {
      return;
    }
    const cities = [];
    const continents = [];
    const countries = [];

    for (const item of items) {
      let { city, continent, country } = item;
      if (!cities.includes(city)) {
        cities.push(city);
      }
      if (!continents.includes(continent)) {
        continents.push(continent);
      }
      if (!countries.includes(country)) {
        countries.push(country);
      }
    }
    const cityFilter = document.createElement('select');
    cityFilter.id = 'city-filter';
    cityFilter.dataset.filter = 'city';
    const cityFilterFirstOpt = document.createElement('option');
    cityFilterFirstOpt.value = 'all';
    cityFilterFirstOpt.innerText = 'Filter by city';
    cityFilter.appendChild(cityFilterFirstOpt);
    for (const city of cities) {
      const opt = document.createElement('option');
      opt.value = city;
      opt.innerText = city;
      cityFilter.appendChild(opt);
    }

    const continentFilter = document.createElement('select');
    continentFilter.id = 'continent-filter';
    continentFilter.dataset.filter = 'continent';
    const continentFilterFirstOpt = document.createElement('option');
    continentFilterFirstOpt.value = 'all';
    continentFilterFirstOpt.innerText = 'Filter by continent';
    continentFilter.appendChild(continentFilterFirstOpt);
    for (const continent of continents) {
      const opt2 = document.createElement('option');
      opt2.value = continent;
      opt2.innerText = continent;
      continentFilter.appendChild(opt2);
    }

    const countryFilter = document.createElement('select');
    countryFilter.id = 'country-filter';
    countryFilter.dataset.filter = 'country';
    const countryFilterFirstOpt = document.createElement('option');
    countryFilterFirstOpt.value = 'all';
    countryFilterFirstOpt.innerText = 'Filter by country';
    countryFilter.appendChild(countryFilterFirstOpt);
    for (const country of countries) {
      const opt3 = document.createElement('option');
      opt3.value = country;
      opt3.innerText = country;
      countryFilter.appendChild(opt3);
    }

    form.appendChild(cityFilter);
    form.appendChild(continentFilter);
    form.appendChild(countryFilter);
  }

  function handleFilter(key = '', value = '') {
    const itemElements = document.querySelectorAll('.grid-item');
    for (const item of itemElements) {
      item.classList.remove('filtered');
    }
    if (value === 'all') {
      return;
    }
    const filtered = Array.from(itemElements).filter((item) => {
      return item.dataset[key] !== value;
    });
    for (const f of filtered) {
      f.classList.add('filtered');
    }
  }

  function handleFilters(form, container) {
    const selectElements = form.querySelectorAll('select');
    for (const select of selectElements) {
      const key = select.dataset.filter;
      select.addEventListener('change', () => {
        container.classList.remove('filter-active');
        const value = select.options[select.selectedIndex].value;
        if (value) {
          handleFilter(key, value);
          if (value !== 'all') {
            container.classList.add('filter-active');
          }
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const gridContent = document.getElementById('grid-content');
    const gridFilters = document.querySelector('.grid-filters');

    insertGridItems(gridContent, 9);
    createFilters(gridFilters);
    handleFilters(gridFilters, gridContent);
  });
})();
