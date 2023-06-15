const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

dataPanel.addEventListener('click', function onPanelClick(e){
  let target = e.target

  if(target.matches('.btn-show-movie')){
    showMovieModal(target.dataset.id)
  } else if (target.matches('.btn-remove-favorite')){
    removeToFavorite(Number(target.dataset.id))
  }
})

//      function       //

function removeToFavorite(id){
  if (!movies || !movies.length) return

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  //刪除該筆電影
  movies.splice(movieIndex,1)

  //存回 local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  //更新頁面
  renderMovieList(movies)
}

function showMovieModal(id){
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id)
  .then(res => {
    const data = res.data.results;
    movieTitle.innerText = data.title
    movieDate.innerText = data.release_date
    movieDescription.innerText = data.description
    movieImage.innerHTML = `
    <img src = "${POSTER_URL + data.image}" class="img-fluid"
    alt="movie-poster">
    `
  })
}

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src = "${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
    </div>
  `
    return dataPanel.innerHTML = rawHTML
  })
}

renderMovieList(movies);