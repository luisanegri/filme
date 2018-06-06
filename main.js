//Create an event for when the form is submitted, store value to variable, use variable in the getFilms function
$(document).ready(() => {
  $('#searchForm').on('click', (e) => {
    let searchText = $('#searchText').val();
    getFilms(searchText);
    e.preventDefault();
  })
});


function getFilms(searchText) {
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=481bce5538131467b4d3508eda2d7e05&language=en&include_image_language=en,null&query=' + searchText)
    .then((response) => {
      let films = response.data.results;
      let output = [];
      $.each(films, (index, film) => {
        output.push(`
        <div class="col-md-3">
          <div class="well text-center well-results">
            <img src="https://image.tmdb.org/t/p/w185/${film.poster_path}">
            <h5 class="film-title">${film.title}</h5>
            <a onclick="switchPage('${film.id}')" class="btn btn-primary" href="#">Film Details</a>
          </div>
        </div>
      `);
      });
      $('#films').html(output.join(""));
    })
    .catch((err) => {
      console.log(err);
    });
}

// store data on sessionStorage and pass data to one page to another
function switchPage(id) {
  sessionStorage.setItem('filmId', id);
  window.location = 'film.html';
  return false;
}

//use ID stored on sessionStorage to get the chosen film details
function filmDetails() {
  let filmId = sessionStorage.getItem('filmId');
  axios.get('https://api.themoviedb.org/3/movie/' + filmId + '?api_key=481bce5538131467b4d3508eda2d7e05&language=en-US')
    .then((response) => {
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
            <li class="list-group-item"><strong>Genre:</strong> ${film.genres[0].name}</li>
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

// use ID stored on sessionStorage to get recommendations according to the chosen film
function recommendations() {
  let filmId = sessionStorage.getItem('filmId');
  axios.get('https://api.themoviedb.org/3/movie/' + filmId + '/recommendations?api_key=481bce5538131467b4d3508eda2d7e05&language=en-US&page=1')
    .then((response) => {
      let recommend = response.data.results;
      let output = [];
      $.each(recommend, (index, film) => { //use for loop
        if (index > 5) { //do const
          return false;
        }
        output.push(`
       <div class="col-md-2">
         <div class="well text-center">
           <a onclick="switchPage('${film.id}')" href="#"><img src="https://image.tmdb.org/t/p/w185/${film.poster_path}"></a>
           <a onclick="switchPage('${film.id}')" href="#"><h5>${film.title}</h5></a>
         </div>
       </div>
       <hr>
       `);
      });
      $('#recommend').html(output.join(""));
      filmDetails();
    })
    .catch((err) => {
      console.log(err);
    });
}


function popularFilms() {
  axios.get('https://api.themoviedb.org/3/discover/movie?api_key=481bce5538131467b4d3508eda2d7e05&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1')
    .then((response) => {
      let popular = response.data.results;
      let output = [];
      $.each(popular, (index, film) => {
        if (index > 5) {
          return false;
        }
        output.push(`
          <div class="col-md-2 col-sm-4 col-xs-6">
            <div class="well text-center">
              <a onclick="switchPage('${film.id}')" href="#"><img src="https://image.tmdb.org/t/p/w185/${film.poster_path}" class="pop-img"></a>
              <a onclick="switchPage('${film.id}')" href="#"><h5>${film.title}</h5></a>
            </div>
          </div>
    `);
      });
      $('#popular-films').html(output.join(""));
      filmDetails();
    })
    .catch((err) => {
      console.error(err);
    });
}
