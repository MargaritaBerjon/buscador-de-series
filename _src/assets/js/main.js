'use strict';

const inputSearch = document.querySelector('.js-input-search');
const buttonSearch = document.querySelector('.js-button-search');
const resultsSearch = document.querySelector('.js-results-search');

let seriesResult = [];

function getSeriesResult() {
    const userSearch = inputSearch.value.toLowerCase();
    fetch(`http://api.tvmaze.com/search/shows?q=${userSearch}`).then(response => response.json()).then(data => {
        drawItems(data);
    });
}

function drawItems(series) {
    for (const serie of series) {
        console.log(serie.show.name);
    }
}

buttonSearch.addEventListener('click', getSeriesResult);


