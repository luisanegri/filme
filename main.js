//Create an event for when the form is submitted
$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getFilms(searchText);
    //stop form from submitting to a file
    e.preventDefault();
  });
});

//Create getFilms function
function getFilms(searchText) {
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=481bce5538131467b4d3508eda2d7e05&language=en&include_image_language=en,null&query=' +searchText)
    .then((response) => {
    console.log(response);
    let films = response.data.results;
    let output = '';
    $.each(films, (index, film) => {
      output += `
        <div class="col-md-3">
          <div class="well text-center">
            <img src="https://image.tmdb.org/t/p/w185/${film.poster_path}">
            <h5>${film.title}</h5>
            <a onclick="filmSelected('${film.id}')" class="btn btn-primary" href="#">Movie Details</a>
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

//create filmSelected function and Save data to sessionStorage - data stored in sessionStorage gets cleared when the page session ends
function filmSelected(id){
  sessionStorage.setItem('filmId', id);
  window.location = 'film.html';
  return false;
}

function getFilm(){
  //get the filmId from local storage
  let filmId = sessionStorage.getItem('filmId');

  axios.get('https://api.themoviedb.org/3/movie?api_key=481bce5538131467b4d3508eda2d7e05&movie_id='+filmId)
  .then((response) => {
  console.log(response);

})
.catch((err) => {
  console.log(err);
});
}
