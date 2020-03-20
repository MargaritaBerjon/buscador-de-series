'use strict';

const inputSearch = document.querySelector('.js-input-search');
const buttonSearch = document.querySelector('.js-button-search');

//Array para guardar resultados de la petición
let seriesResult = [];
//Array para guardar favoritos
let favoriteArr = [];

getFavoritesFromLocalStorage();

//Carga al iniciar la aplicación los favoritos (si los hay)
function getFavoritesFromLocalStorage() {
  const favoritesList = document.querySelector('.js-favorites');
  if (JSON.parse(localStorage.getItem('favorites'))) {
    favoriteArr = JSON.parse(localStorage.getItem('favorites'));
    for (const serie of favoriteArr) {
      const favoriteCard = paintSerie(serie, favoritesList);
      favoriteCard.classList.remove('card');
      favoriteCard.classList.add('favorite-card');
      favoriteCard.addEventListener('click', deleteFavorites);
    }
  }
}


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

//Función para pintar una serie. (serie=> serie a pintar, container=> donde se pinta la serie) Cada serie está dentro de un li. 
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
  ev.currentTarget.classList.remove('card');
  ev.currentTarget.classList.add('card-result-favorite');

  if (findSerie(id, favoriteArr)) {
    alert('SERIE YA ESTA EN FAVORITOS');
  } else {
    const favoriteCard = paintSerie(serie, favoritesList);
    favoriteCard.classList.remove('card');
    favoriteCard.classList.add('favorite-card');
    favoriteCard.addEventListener('click', deleteFavorites);
    saveFavoriteSerie(serie);
  }
}


function deleteFavorites(ev) {
  const favoritesContainer = document.querySelector('.js-favorites');
  const id = ev.currentTarget.id;

  const serie = findSerie(id, favoriteArr);
  favoriteArr.splice(favoriteArr.indexOf(serie));
  localStorage.setItem('favorites', JSON.stringify(favoriteArr));
  favoritesContainer.removeChild(ev.currentTarget);
}

//Guarda los favoritos en: favoritesArr y LocalStorage
function saveFavoriteSerie(serie) {
  favoriteArr.push(serie);
  localStorage.setItem('favorites', JSON.stringify(favoriteArr));
}



//Esta función sirve para encontrar la serie a través del id
function findSerie(id, seriesResult) {
  //El id que devuelve es un string, por eso parseInt
  id = parseInt(id);
  return seriesResult.find(serie => serie.show.id === id);
}


buttonSearch.addEventListener('click', callSeriesResult);

