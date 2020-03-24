'use strict';
const inputSearch = document.querySelector('.js-input-search');
const buttonSearch = document.querySelector('.js-button-search');
// ul donde meto cada li de favotitos
const favoritesList = document.querySelector('.js-favorites');
//contenedor donde meto las series
const resultsContainer = document.querySelector('.js-results-search');
//Array para guardar resultados de la petición
let seriesResult = [];
//Array para guardar favoritos
let favoriteArr = [];

getFavoritesFromLocalStorage();
buttonRemoveVisibility();

//Carga al iniciar la aplicación los favoritos (si los hay)
function getFavoritesFromLocalStorage() {
  if (JSON.parse(localStorage.getItem('favorites'))) {
    favoriteArr = JSON.parse(localStorage.getItem('favorites'));
    for (const serie of favoriteArr) {
      paintFavoriteSerie(serie);
    }
  }
}

//Función para hacer peticiones al API
function callSeriesResult(ev) {
  ev.preventDefault();
  const userSearch = inputSearch.value.toLowerCase();
  fetch(`http://api.tvmaze.com/search/shows?q=${userSearch}`)
    .then(response => response.json())
    .then(data => {
      seriesResult = data;
      paintSeries();
    });
}
//Función para pintar listado de resultados de la búsqueda
function paintSeries() {
  resultsContainer.innerHTML = '';
  for (const serie of seriesResult) {
    //La función paintSerie retorna un li, (card) al que a añado un listener
    const card = paintSerie(serie, resultsContainer);
    card.addEventListener('click', addFavorite);
    for (const serieFav of favoriteArr) {
      if (serie.show.id === serieFav.show.id) {
        card.classList.add('card-result-favorite');
      }
    }
  }
}

//Función para pintar una serie. (serie=> serie a pintar, container=> donde se pinta la serie) Cada serie está dentro de un li.
function paintSerie(serie, container) {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const title = document.createElement('p');
  const gender = document.createElement('p');
  title.innerHTML = serie.show.name;
  gender.innerHTML = serie.show.genres;
  if (serie.show.image !== null) {
    img.src = serie.show.image.medium;
  } else {
    img.src = 'https://via.placeholder.com/210x295/ffffff/666666/?';
  }
  li.id = serie.show.id;
  li.appendChild(img);
  li.appendChild(title);
  li.appendChild(gender);
  li.classList.add('card', 'js-card');
  container.appendChild(li);
  container.classList.add('series-result');
  return li;
}

function addFavorite(ev) {
  //recoge el id de la serie añadida a favoritos (elemento clicado)
  const id = ev.currentTarget.id;
  const serie = findSerie(id, seriesResult);
  if (findSerie(id, favoriteArr)) {
    alert('SERIE YA ESTA EN FAVORITOS');
  } else {
    ev.currentTarget.classList.remove('card');
    ev.currentTarget.classList.add('card-result-favorite');
    paintFavoriteSerie(serie);
    saveFavoriteSerie(serie);
    buttonRemoveVisibility();
  }
}

function removeFavorite(ev) {
  const id = ev.currentTarget.parentElement.id;
  //eliminar serie del array local(favoriteArr)
  const serie = findSerie(id, favoriteArr);
  const seriePosition = favoriteArr.indexOf(serie);
  favoriteArr.splice(seriePosition, 1);
  // Sobreescribo el objeto en localStorage
  localStorage.setItem('favorites', JSON.stringify(favoriteArr));
  //para quitar de la vista
  favoritesList.removeChild(ev.currentTarget.parentElement);
  paintSeries();
  buttonRemoveVisibility();
}

//Guarda los favoritos en: favoritesArr y LocalStorage
function saveFavoriteSerie(serie) {
  favoriteArr.push(serie);
  localStorage.setItem('favorites', JSON.stringify(favoriteArr));
}


function paintFavoriteSerie(serie) {
  const favoriteCard = paintSerie(serie, favoritesList);
  favoritesList.classList.remove('series-result');
  favoriteCard.classList.remove('card');
  favoriteCard.classList.add('favorite-card');
  favoriteCard.querySelector('img').classList.add('img-favorite');
  favoriteCard.removeChild(favoriteCard.childNodes[2]);
  //Add x icon
  const iconDelete = document.createElement('button');
  iconDelete.innerHTML = 'x';
  favoriteCard.appendChild(iconDelete);
  iconDelete.classList.add('icon-delete');
  iconDelete.addEventListener('click', removeFavorite);
}

//Esta función sirve para encontrar la serie a través del id
function findSerie(id, arr) {
  //El id que devuelve es un string, por eso parseInt
  id = parseInt(id);
  return arr.find(serie => serie.show.id === id);
}

function buttonRemoveVisibility() {
  const favoriteSection = document.querySelector('.js-favorite-container');
  const deleteButton = document.querySelector('.delete-all-favorites');
  if (favoriteArr.length) { //Si hay favoritos
    if (!deleteButton) { //Si no existe el botón
      const removeAllfavorites = document.createElement('button');
      removeAllfavorites.innerHTML = 'Borrar favoritos';
      removeAllfavorites.classList.add('delete-all-favorites');
      favoriteSection.appendChild(removeAllfavorites);
      const buttonRemove = document.querySelector('.delete-all-favorites');
      buttonRemove.addEventListener('click', removeAllFavorites);
    }
  } else if (deleteButton) { //Si existe el botón y no hay favoritos
    favoriteSection.removeChild(deleteButton.parentElement.lastChild);
  }

}

function removeAllFavorites() {
  favoriteArr = [];
  favoritesList.innerHTML = '';
  localStorage.removeItem('favorites');
  paintSeries();
  buttonRemoveVisibility();
}

buttonSearch.addEventListener('click', callSeriesResult);