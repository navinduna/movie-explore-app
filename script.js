const API_KEY = '7e3ab06efe7e8901139416334bd9b4dc';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');

// 1. Fetch Trending Movies on Load
window.onload = () => fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);

// 2. Search Functionality (Instant Search)
searchInput.addEventListener('keyup', (e) => {
    const query = e.target.value;
    if (query) {
        fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    }
});

async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.className = 'glass rounded-2xl overflow-hidden hover:scale-105 transition transform duration-300';
        movieEl.innerHTML = `
            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/500x750'}" alt="${movie.title}">
            <div class="p-4">
                <h3 class="font-bold text-lg truncate">${movie.title}</h3>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-yellow-400"><i class="fa fa-star"></i> ${movie.vote_average}</span>
                    <button onclick="saveMovie('${movie.id}', '${movie.title.replace(/'/g, "\\'")}', '${movie.poster_path}')" 
                        class="text-gray-400 hover:text-red-500 transition">
                        <i class="fa fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        movieGrid.appendChild(movieEl);
    });
}

// 3. Save Movie Logic (Using Local Storage)
function saveMovie(id, title, poster) {
    let saved = JSON.parse(localStorage.getItem('savedMovies')) || [];
    if (!saved.some(m => m.id === id)) {
        saved.push({ id, title, poster });
        localStorage.setItem('savedMovies', JSON.stringify(saved));
        alert('Movie Saved!');
    } else {
        alert('Already Saved!');
    }
}

// 4. Show Saved Movies
function showSaved() {
    let saved = JSON.parse(localStorage.getItem('savedMovies')) || [];
    if (saved.length === 0) return alert("No movies saved yet!");

    movieGrid.innerHTML = '<h2 class="col-span-full text-2xl font-bold border-b border-gray-700 pb-2">Saved Movies</h2>';
    displayMovies(saved.map(m => ({ id: m.id, title: m.title, poster_path: m.poster })));
}
