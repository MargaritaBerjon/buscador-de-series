'use strict';

const inputSearch = document.querySelector('.js-input-search');
const buttonSearch = document.querySelector('.js-button-search');
//ul donde voy a pintar la lista de los resultados
const resultsSearch = document.querySelector('.js-results-search');

//Array para guardar resultados de la petición
let seriesResult = [];

//Función para hacer peticiones al API
function getSeriesResult(ev) {
  ev.preventDefault();
  const userSearch = inputSearch.value.toLowerCase();
  fetch(`http://api.tvmaze.com/search/shows?q=${userSearch}`).then(response => response.json()).then(data => {
    seriesResult = data;
    paintSeries(data);
  });
}

//Función para pintar resultados del API

function paintSeries(seriesResult) {

  for (const serie of seriesResult) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const title = document.createElement('h3');

    title.innerHTML = serie.show.name;
    if (serie.show.image !== null) {
      img.src = serie.show.image.medium;
    } else {
      img.src = 'https://via.placeholder.com/210x295/ffffff/666666/?';
    }
    li.appendChild(title);
    li.appendChild(img);
    li.classList.add('card');
    resultsSearch.appendChild(li);
    resultsSearch.classList.add('series-result');
  }
}
buttonSearch.addEventListener('click', getSeriesResult);