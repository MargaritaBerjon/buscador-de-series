'use strict';

const inputSearch = document.querySelector('.js-input-search');
const buttonSearch = document.querySelector('.js-button-search');

//Array para guardar resultados de la petición
let seriesResult = [];



buttonSearch.addEventListener('click', callSeriesResult);

//Función para hacer peticiones al API
function callSeriesResult(ev) {
  ev.preventDefault();
  const userSearch = inputSearch.value.toLowerCase();
  fetch(`http://api.tvmaze.com/search/shows?q=${userSearch}`).then(response => response.json()).then(data => {
    seriesResult = data;
    paintSeries(data);
  });
}

//Función para pintar listado de resultados de la búsqueda

function paintSeries() {
  const resultsContainer = document.querySelector('.js-results-search');
  for (const serie of seriesResult) {
    //La función paintSerie retorna un li, al que a añado un listener
    paintSerie(serie, resultsContainer).addEventListener('click', paintFavorites);
  }
}

//Función para pintar cada serie en los resultados de la petición al API. Cada serie está dentro de un li.

function paintSerie(serie, container) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const title = document.createElement('p');

  title.innerHTML = serie.show.name;
  if (serie.show.image !== null) {
    img.src = serie.show.image.medium;
  } else {
    img.src = 'https://via.placeholder.com/210x295/ffffff/666666/?';
  }

  li.id = serie.show.id;
  li.classList.add('card', 'js-card');
  li.appendChild(title);
  li.appendChild(img);
  container.appendChild(li);
  container.classList.add('series-result');
  return li;
}

//Función para pintar favoritos


function paintFavorites(ev) {
  //ul donde meto cada li que creo con la función paintSerie (devuelve un li)
  const favoritesList = document.querySelector('.js-favorites');


  //recoge el id de la serie añadida a favoritos (elemento clicado)
  const id = ev.currentTarget.id;

  const serie = findSerie(id, seriesResult);

  const favoriteCard = paintSerie(serie, favoritesList);
  favoriteCard.addEventListener('click', deleteFavorites);
  favoriteCard.classList.remove('card');
  favoriteCard.classList.add('favorite-card');
  // saveFavoriteSerie(serie);
}

function deleteFavorites(ev) {
  const favoritesContainer = document.querySelector('.js-favorites');
  favoritesContainer.removeChild(ev.currentTarget);
}

//Esta función sirve para encontrar la serie a través del id

function findSerie(id, seriesResult) {
  console.log(id);

  //El id que devuelve es un string, por eso parseInt
  id = parseInt(id);
  return seriesResult.find(serie => serie.show.id === id);
}


// function getFavoritesSeriesResult() {
//   let favorites = localStorage.getItem('favorites') || '[]';
//   const favoritesArr = JSON.parse(favorites);
//   return favoritesArr;

// }