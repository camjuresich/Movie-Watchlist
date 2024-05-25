import { apikey, dummyData } from "./apikey.js";

const search = document.getElementById("search");
const submit = document.getElementById("search-submit");
const form = document.getElementById("form");
const searchResultsEl = document.getElementById('search-results')

submit.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const searchQuery = formData.get("search-text");
    console.log(searchQuery);
    async function getResults() {
        const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apikey}&s=${searchQuery}`
        );
        const data = await res.json();
        console.log(data.Search);
        renderMovies(data);
    }
    getResults();
    // renderMovies(dummyData);
});

function renderMovies(dataObj) {
    const { Search: moviesArr } = dataObj;
    let html = ''
    const changeThis = 'change this'
    moviesArr.forEach((movie) => {
        // for each element I will need to make a separate api call to get the description and the rating as well as the runtime.
        html += `
        <div class="movie">
            <img
                class="movie-cover"
                src="${movie.Poster}"
                alt=""
            />
            <h2 class="movie-title">${movie.Title}</h2>
            <div class="rating">
                <i class="fi-xxxxxm-star-solid star"></i>
                <p class="movie-rating">change me</p>
            </div>
            <p class="movie-runtime">117 min</p>
            <p class="movie-genres">${changeThis}</p>
            <div class="add-to-watchlist-btn">
                <i class="fi-cwsuxm-plus-solid watchlist"></i>
                <button class="watchlist-btn">Watchlist</button>
            </div>
            <p class="movie-description max-lines">
            Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Perferendis vero explicabo vitae obcaecati, sunt
            nemo doloremque officia numquam tempore ratione rem
            laudantium quae est esse ab. Vitae unde modi aspernatur!
            </p>
        </div>`
    })
    searchResultsEl.innerHTML = html
    friconix_update();
}

// https://www.omdbapi.com/?apikey=${apikey}&s=${searchquery}
