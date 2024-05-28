import { renderMovies } from "./app.js";

renderMovies(JSON.parse(localStorage.getItem('movies')))
