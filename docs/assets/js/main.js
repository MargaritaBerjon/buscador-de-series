"use strict";const inputSearch=document.querySelector(".js-input-search"),buttonSearch=document.querySelector(".js-button-search");let seriesResult=[],favoriteArr=[];function getFavoritesFromLocalStorage(){const e=document.querySelector(".js-favorites");if(JSON.parse(localStorage.getItem("favorites"))){favoriteArr=JSON.parse(localStorage.getItem("favorites"));for(const t of favoriteArr){const r=paintSerie(t,e);r.classList.remove("card"),r.classList.add("favorite-card"),r.querySelector("img").classList.add("img-favorite");const a=document.createElement("button");a.innerHTML="x",r.appendChild(a),a.classList.add("icon-delete"),a.addEventListener("click",deleteFavorites)}}}function callSeriesResult(e){e.preventDefault();const t=inputSearch.value.toLowerCase();fetch(`http://api.tvmaze.com/search/shows?q=${t}`).then(e=>e.json()).then(e=>{seriesResult=e,paintSeries(e)})}function paintSeries(){const e=document.querySelector(".js-results-search");for(const t of seriesResult)paintSerie(t,e).addEventListener("click",paintFavorites)}function paintSerie(e,t){const r=document.createElement("li"),a=document.createElement("img"),i=document.createElement("p");return i.innerHTML=e.show.name,null!==e.show.image?a.src=e.show.image.medium:a.src="https://via.placeholder.com/210x295/ffffff/666666/?",r.id=e.show.id,r.classList.add("card","js-card"),r.appendChild(a),r.appendChild(i),t.appendChild(r),t.classList.add("series-result"),r}function paintFavorites(e){const t=e.currentTarget.id,r=findSerie(t,seriesResult);if(findSerie(t,favoriteArr))alert("SERIE YA ESTA EN FAVORITOS");else{e.currentTarget.classList.remove("card"),e.currentTarget.classList.add("card-result-favorite");const t=document.querySelector(".js-favorites"),a=document.createElement("button");a.innerHTML="x",a.classList.add("icon-delete");const i=paintSerie(r,t);i.appendChild(a),i.classList.remove("card"),i.classList.add("favorite-card"),i.querySelector("img").classList.add("img-favorite"),a.addEventListener("click",deleteFavorites),saveFavoriteSerie(r)}}function deleteFavorites(e){const t=document.querySelector(".js-favorites"),r=findSerie(e.currentTarget.parentElement.id,favoriteArr);favoriteArr.splice(favoriteArr.indexOf(r)),localStorage.setItem("favorites",JSON.stringify(favoriteArr)),t.removeChild(e.currentTarget.parentElement)}function saveFavoriteSerie(e){favoriteArr.push(e),localStorage.setItem("favorites",JSON.stringify(favoriteArr))}function findSerie(e,t){return e=parseInt(e),t.find(t=>t.show.id===e)}function createButtonRemove(){const e=document.querySelector(".js-favorite-container");if(e){const t=document.createElement("button");t.innerHTML="Borrar favoritos",t.classList.add("delete-all-favorites"),e.appendChild(t),document.querySelector(".delete-all-favorites").addEventListener("click",removeAllFavorites)}}function removeAllFavorites(){const e=document.querySelector(".js-favorites");favoriteArr=[],e.innerHTML="",localStorage.removeItem("favorites"),console.log(favoriteArr)}getFavoritesFromLocalStorage(),createButtonRemove(),buttonSearch.addEventListener("click",callSeriesResult);