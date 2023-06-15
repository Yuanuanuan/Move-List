const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.getElementById('paginator')
const iconPanel = document.querySelector('.icon')

const MOVIES_PER_PAGE = 12
let filteredMovies = []

let currentPage = 1

axios.get(INDEX_URL)
.then(res => {
  movies.push(...res.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMovieByPage(currentPage))
})
.catch(err => console.log(err))

//----------------- 設置監聽器 -------------------//

// More 跟 + 按鈕的監聽器
dataPanel.addEventListener('click', function onPanelClick(e) {
  let target = e.target

  if(target.matches('.btn-show-movie')){
    showMovieModal(target.dataset.id)
  } else if (target.matches('.btn-add-favorite')){
    addToFavorite(target.dataset.id)
  }
})

// 分頁的監聽器
paginator.addEventListener('click', function paginatorOnClick(e) {
  if (e.target.tagName !== 'A') return

  const page = Number(e.target.dataset.page)
  currentPage = page
  renderMovieList(getMovieByPage(currentPage))
})

// 搜尋欄的監聽器
searchForm.addEventListener('submit', function onClickSearchForm(e) {
  e.preventDefault()
  let keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

  if (filteredMovies.length === 0){
    return alert('Cannot find movie with the keyword: ' + keyword)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(currentPage))
})

iconPanel.addEventListener('click', function onClickIconPanel(e) {
  if (e.target.classList.contains('card-mode-btn')) {
    changeMode('card-mode')
    renderMovieList(getMovieByPage(currentPage))
  } else {
    changeMode('list-mode')
    renderMovieList(getMovieByPage(currentPage))
  }
})

//----------------- function -------------------//

function changeMode(displaymode) {
  if (dataPanel.dataset.mode === displaymode) return
  dataPanel.dataset.mode = displaymode
}

// 設定分頁<li>數量
function renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++){
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

// 獲取第幾頁的電影資訊
function getMovieByPage(page){
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 收藏電影
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === parseInt(id))
  if (list.some((movie) => movie.id === parseInt(id))){
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 顯示電影的更多資訊
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

// 將電影資料渲染在網頁上
function renderMovieList(data) {
  if (dataPanel.dataset.mode === 'card-mode') {
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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
    </div>
  `
    dataPanel.innerHTML = rawHTML;
  })
  } else if (dataPanel.dataset.mode === 'list-mode') {
    let rawHTML = ''
    data.forEach(item => {
    rawHTML += `
          <div class="card  border-0 border-top">
            <div class="card-body d-flex justify-content-between">
              <h5 class="card-title">${item.title}</h5>
              <div class="bottom">
                <button class="btn btn-primary btn-show-movie me-3" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite me-5" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
  `
    dataPanel.innerHTML = rawHTML;
  })
  }
}