import { apikey } from "./apikey.js";

const submit = document.getElementById("search-submit");
const form = document.getElementById("form");
const searchResultsEl = document.getElementById("search-results");


// console.log(localStorage.getItem('movies')[0])

document.addEventListener("click", (e) => {
    const containingElement = e.target.parentElement
    const parentDiv = containingElement.parentElement
    if (e.target === submit) {
        e.preventDefault() 
        submitButtonFunc()
    }
    if (containingElement.classList.contains('add-to-watchlist-btn')) {
        const children = parentDiv.children
        const data = {
            imdbID: parentDiv.id,
            Poster: children[0].src,
            Title: children[1].textContent,
            imdbRating: children[2].textContent.trim(),
            Runtime: children[3].textContent,
            Genre: children[4].textContent,
            Plot: children[6].textContent.trim()

        }
        // console.log(data)
        if (!localStorage.getItem('movies')) {
            localStorage.setItem('movies', '[]')
        }
        const moviesFromLocalStorage = JSON.parse(localStorage.getItem('movies'))
        moviesFromLocalStorage.push(data)
        localStorage.setItem('movies', JSON.stringify(moviesFromLocalStorage)) 
        containingElement.innerHTML = watchlistToggleFunc(true, containingElement)
        friconix_update()
    } else if (containingElement.classList.contains('remove-from-watchlist-btn')) {
        const moviesFromLocalStorage = JSON.parse(localStorage.getItem('movies'))
        for (let i = 0; i < moviesFromLocalStorage.length; i++) {
            let movie = moviesFromLocalStorage[i];
            if (movie.imdbID === parentDiv.id) {
                moviesFromLocalStorage.splice(i, 1)
                localStorage.setItem('movies', JSON.stringify(moviesFromLocalStorage))
                containingElement.innerHTML = watchlistToggleFunc(false, containingElement)
                friconix_update()
            }
        } if (location.href.endsWith('watchlist.html')){
            renderMovies(moviesFromLocalStorage)
        }
        
    }
    
})


function submitButtonFunc () {
    const formData = new FormData(form);
    const searchQuery = formData.get("search-text");
    console.log(searchQuery);
    async function getResults() {
        const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apikey}&s=${searchQuery}`
        );
        const data = await res.json();
        console.log(data.Search);

        
        const fullMoviesData = await Promise.all(
            data.Search.map(async (movie) => {
                const movieData = await getIndividualMoiveData(movie);
                return movieData;
            })
        );

        console.log(fullMoviesData);
        renderMovies(fullMoviesData);
    }
    getResults();
    // renderMovies(dummyIRequestData);
}

async function getIndividualMoiveData(movieObj) {
    const result = await fetch(
        `https://www.omdbapi.com/?apikey=${apikey}&i=${movieObj.imdbID}`
    );
    const data = await result.json();
    return data
}

function watchlistToggleFunc (isAddedToWatchlist, el) { // Takes a boolean 
    if (el) {
        if (el.classList.contains('add-to-watchlist-btn')) {
            console.log('did it trigger?')
            el.classList.add('remove-from-watchlist-btn')
            el.classList.remove('add-to-watchlist-btn')
            return `
            <button class="watchlist-btn"><i class="fi-cwsuxm-minus-solid watchlist"></i>Watchlist</button>`
        } else {
            el.classList.remove('remove-from-watchlist-btn')
            el.classList.add('add-to-watchlist-btn')
            return `
            <button class="watchlist-btn"><i class="fi-cwsuxm-plus-solid watchlist"></i>Watchlist</button>`
        }

    }
    if (isAddedToWatchlist) {
        return `
        <div class="remove-from-watchlist-btn">
            
            <button class="watchlist-btn"><i class="fi-cwsuxm-minus-solid watchlist"></i>Watchlist</button>
        </div>`
    } return `
        <div class="add-to-watchlist-btn">
        
        <button class="watchlist-btn"><i class="fi-cwsuxm-plus-solid watchlist"></i>Watchlist</button>
        </div>`
}

export function renderMovies(dataArr) {
    document.getElementById('search-results').classList.remove('empty')
    let html = "";
    const moviesFromLocalStorage = JSON.parse(localStorage.getItem('movies'))
    const getButtonType = (movieId) => {

        if (!moviesFromLocalStorage) {
            return watchlistToggleFunc(false)
        }
        for (let movie of moviesFromLocalStorage) {
            if (movie.imdbID === movieId) {
                return watchlistToggleFunc(true)
            }
        }
        return watchlistToggleFunc(false)
    }
    dataArr.forEach((movie) => {
        // for each element I will need to make a separate api call to get the description and the rating as well as the runtime.
        html += `
        <div class="movie" id="${movie.imdbID}">
            <img
                class="movie-cover"
                src="${movie.Poster}"
                alt=""
            />
            <h2 class="movie-title">${movie.Title}</h2>
            <div class="rating">
                <i class="fi-xxxxxm-star-solid star"></i>
                <p class="movie-rating">${movie.imdbRating}</p>
            </div>
            <p class="movie-runtime">${movie.Runtime}</p>
            <p class="movie-genres">${movie.Genre}</p>
            ${getButtonType(movie.imdbID)}
            <p class="movie-description max-lines">
                ${movie.Plot}
            </p>
        </div>`;
    });

    if (!dataArr.length) {
        document.getElementById('search-results').classList.add('empty')

        html = `<h2>Your watchlist is looking a little empty...</h2>
                <h3><a href="index.html"><i class="fi-cwsuxm-plus-solid watchlist"></i> Add some movies!!!</a></h3>`

    }
    searchResultsEl.innerHTML = html;
    friconix_update();
}

// https://www.omdbapi.com/?apikey=${apikey}&s=${searchquery}
