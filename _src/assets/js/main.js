'use strict';

const inputSearch = document.querySelector('.js-input-search');
const buttonSearch = document.querySelector('.js-button-search');
//ul donde voy a pintar la lista de los resultados
const resultsSearch = document.querySelector('.js-results-search');

//Array para guardar resultados de la petición
let seriesResult = [];

function getSeriesResult(ev) {
  ev.preventDefault();
  const userSearch = inputSearch.value.toLowerCase();
  fetch(`http://api.tvmaze.com/search/shows?q=${userSearch}`).then(response => response.json()).then(data => {
    seriesResult = data;
    paintSeries(data);


  });
}

function paintSeries(seriesResult) {
  for (const serie of seriesResult) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const title = document.createElement('h3');

    title.innerHTML = serie.show.name;
    img.src = serie.show.image.medium;
    li.appendChild(title);
    li.appendChild(img);
    resultsSearch.appendChild(li);
  }

}

buttonSearch.addEventListener('click', getSeriesResult);


