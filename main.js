// ------------------ Query search ------------------ //
//Create an event for when the form is submitted, pass value to variable, pass variable content to function
$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getFilms(searchText);
    e.preventDefault();
  })
});


function getFilms(searchText) {
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=481bce5538131467b4d3508eda2d7e05&language=en&include_image_language=en,null&query=' + searchText)
    .then((response) => {

      //data stored on the films variable
      let films = response.data.results;
      let output = '';
      $.each(films, (index, film) => {
        output += `
        <div class="col-md-3">
          <div class="well text-center">
            <img src="https://image.tmdb.org/t/p/w185/${film.poster_path}">
            <h5>${film.title}</h5>
            <a onclick="filmSelected('${film.id}')" class="btn btn-primary" href="#">Film Details</a>
          </div>
        </div>
      `;
      });
      $('#films').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
//pass data to one page to another through session storage
function filmSelected(id) {
  sessionStorage.setItem('filmId', id);
  window.location = 'film.html';
  return false;
}

function getFilmDetails() {
  let filmId = sessionStorage.getItem('filmId');
  axios.get('https://api.themoviedb.org/3/movie/' + filmId + '?api_key=481bce5538131467b4d3508eda2d7e05&language=en-US')
    .then((response) => {
      console.log(response);
      //store data
      let film = response.data;
      let output = `
      <div class="row">
        <div class="col-md-4">
          <img src="https://image.tmdb.org/t/p/w500/${film.poster_path}" class="thumbnail img-poster">
        </div>
        <div class="col-md-8  desc">
          <h2>${film.title}</h2>
          <ul class="list-group">
            <li class="list-group-item"><strong>Genre:</strong> ${film.genres.name}</li>
            <li class="list-group-item"><strong>Released:</strong> ${film.release_date}</li>
            <li class="list-group-item"><strong>Rated:</strong> ${film.vote_average}</li>
            <li class="list-group-item"><a href="${film.homepage}" target="_blank"> Website</a></li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="well overview">
          <h3>Overview</h3>
          ${film.overview}

        </div>
      </div>
      `;
      $('#film').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getRecommendations() {
  let filmId = sessionStorage.getItem('filmId');
  axios.get('https://api.themoviedb.org/3/movie/' + filmId + '/recommendations?api_key=481bce5538131467b4d3508eda2d7e05&language=en-US&page=1')
    .then((response) => {
      console.log(response);
      let recommend = response.data.results;
      let output = '';
      $.each(recommend, (index, film) => {
        if (index > 5) {
          return false;
        }
        output += `
       <div class="col-md-2">
         <div class="well text-center">
           <a onclick="filmSelected('${film.id}')" href="#"><img src="https://image.tmdb.org/t/p/w185/${film.poster_path}"></a>
           <a onclick="filmSelected('${film.id}')" href="#"><h5>${film.title}</h5></a>
         </div>
       </div>
       <hr>
       `;
      });
      $('#recommend').html(output);
      getFilmDetails();
    })
    .catch((err) => {
      console.log(err);
    });
}

function getPopFilms() {
  axios.get('https://api.themoviedb.org/3/discover/movie?api_key=481bce5538131467b4d3508eda2d7e05&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1')
    .then((response) => {
      console.log(response);
      let popFilms = response.data.results;
      let popOutput = '';
      $.each(popFilms, (index, film) => {
        if (index > 5) {
          return false;
        }
        popOutput += `
<div class="col-md-2 col-sm-4 col-xs-6">
      <div class="well text-center">
        <a onclick="filmSelected('${film.id}')" href="#"><img src="https://image.tmdb.org/t/p/w185/${film.poster_path}" class="pop-img"></a>
        <a onclick="filmSelected('${film.id}')" href="#"><h5>${film.title}</h5></a>
      </div>
    </div>
    `;
      });
      $('#popular-films').html(popOutput);
      getFilmDetails();
    })
    .catch((err) => {
      console.log(err);
    });
}
