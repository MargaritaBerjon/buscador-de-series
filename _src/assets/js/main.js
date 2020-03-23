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
      favoritesList.classList.remove('series-result');
      favoriteCard.classList.remove('card');
      favoriteCard.classList.add('favorite-card');
      favoriteCard.querySelector('img').classList.add('img-favorite');
      const iconDelete = document.createElement('button');
      iconDelete.innerHTML = 'x';
      favoriteCard.appendChild(iconDelete);
      iconDelete.classList.add('icon-delete');

      iconDelete.addEventListener('click', deleteFavorites);
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
  resultsContainer.innerHTML = '';
  for (const serie of seriesResult) {
    //La función paintSerie retorna un li, (card) al que a añado un listener
    const card = paintSerie(serie, resultsContainer);
    card.addEventListener('click', paintFavorites);
    for (const serieFav of favoriteArr) {
      if (serie.show.id === serieFav.show.id) {
        card.classList.add('card-result-favorite', 'js-card');
      } else {
        card.classList.add('card', 'js-card');
      }
    }

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
  li.appendChild(img);
  li.appendChild(title);
  container.appendChild(li);
  container.classList.add('series-result');
  return li;
}


function paintFavorites(ev) {
  //recoge el id de la serie añadida a favoritos (elemento clicado)
  const id = ev.currentTarget.id;
  const serie = findSerie(id, seriesResult);


  if (findSerie(id, favoriteArr)) {
    alert('SERIE YA ESTA EN FAVORITOS');
  } else {
    ev.currentTarget.classList.remove('card');
    ev.currentTarget.classList.add('card-result-favorite');


    //ul donde meto cada li que creo con la función paintSerie (devuelve un li)
    const favoritesList = document.querySelector('.js-favorites');
    //Creo el botón para eliminar una serie de la lista
    const iconDelete = document.createElement('button');
    iconDelete.innerHTML = 'x';
    iconDelete.classList.add('icon-delete');
    //Constante que llama a la función paintSerie para pintar la card tipo
    const favoriteCard = paintSerie(serie, favoritesList);
    favoriteCard.appendChild(iconDelete);
    favoriteCard.classList.remove('card');
    favoriteCard.classList.add('favorite-card');
    favoritesList.classList.remove('series-result');
    favoriteCard.querySelector('img').classList.add('img-favorite');
    iconDelete.addEventListener('click', deleteFavorites);

    saveFavoriteSerie(serie);
  }
}


function deleteFavorites(ev) {
  const favoritesContainer = document.querySelector('.js-favorites');
  const id = ev.currentTarget.parentElement.id;

  //eliminar serie del array local(favoriteArr)
  const serie = findSerie(id, favoriteArr);
  favoriteArr.splice(favoriteArr.indexOf(serie), 1);
  // Sobreescribo el objeto en localStorage
  localStorage.setItem('favorites', JSON.stringify(favoriteArr));
  //para quitar de la vista
  favoritesContainer.removeChild(ev.currentTarget.parentElement);
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

function createButtonRemove() {
  const favoriteSection = document.querySelector('.js-favorite-container');
  if (favoriteSection) {
    const removeAllfavorites = document.createElement('button');
    removeAllfavorites.innerHTML = 'Borrar favoritos';
    removeAllfavorites.classList.add('delete-all-favorites');
    favoriteSection.appendChild(removeAllfavorites);
    const buttonRemove = document.querySelector('.delete-all-favorites');
    buttonRemove.addEventListener('click', removeAllFavorites);

  }
}
createButtonRemove();

function removeAllFavorites() {
  const favoritesContainer = document.querySelector('.js-favorites');
  favoriteArr = [];
  favoritesContainer.innerHTML = '';
  localStorage.removeItem('favorites');
}

buttonSearch.addEventListener('click', callSeriesResult);

