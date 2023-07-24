// TMDB API

const apiKey = "api_key=04aab569d7ca260c837facd7b0507f4d";
const originURL = "https://api.themoviedb.org/3";
const homeURL = originURL + "/discover/movie?sort_by=popularity.desc&" + apiKey;
const imgURL = "https://image.tmdb.org/t/p/w500/";
const searchURL = originURL + "/search/movie?" + apiKey;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const genreSelect = document.getElementById("genre-tags");

let selectedGenre = [];

displayGenre();
function displayGenre() {
  genreSelect.innerHTML = "";
  genres.forEach((genre) => {
    const genreTags = document.createElement("div");
    genreTags.classList.add("genre");
    genreTags.id = genre.id;
    genreTags.innerText = genre.name;
    genreTags.addEventListener("click", function () {
      if (selectedGenre.length == 0) {
        // if no genre is being selected, we want to push the genre into the selectedGenre array.
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, index) => {
            // id gives you the element, index gives you the position of the element
            if (id == genre.id) {
              // if the id is selected again, we will want to remove the element
              selectedGenre.splice(index, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      fetchMovies(
        homeURL + "&with_genres=" + encodeURI(selectedGenre.join(","))
      );
      selectedGenreTags();
    });
    genreSelect.append(genreTags);
  });
}

function selectedGenreTags() {
  const tags = document.querySelectorAll(".genre");
  tags.forEach((tag) => {
    tag.classList.remove("selected");
  });
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      // get all the id from the array
      const selectedTag = document.getElementById(id);
      selectedTag.classList.add("selected");
    });
  }
}

fetchMovies(homeURL);

function fetchMovies(url) {
  lastURL = url;
  fetch(url)
    .then((response) => response.json())
    .then((movies) => {
      displayMovies(movies.results);
    });
}

const searchInput = document.getElementById("search-bar");
const form = document.getElementById("form");
const webTitle = document.getElementById("web-title");

webTitle.addEventListener("click", () => {
  fetchMovies(homeURL);
  selectedGenre = [];
  displayGenre();
  searchInput.value = "";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchQuery = searchInput.value;
  selectedGenre = [];
  displayGenre();

  if (searchQuery) {
    fetchMovies(searchURL + "&query=" + searchQuery);
  } else {
    fetchMovies(homeURL);
  }
});

function displayMovies(movies) {
  const movieList = document.getElementById("movie-list");
  movieList.innerHTML = "";

  if (movies.length === 0) {
    const noMoviesMessage = document.createElement("h1");
    noMoviesMessage.classList.add("col", "no-movie-message");
    noMoviesMessage.textContent = "No movies found.";
    movieList.appendChild(noMoviesMessage);
    return;
  }

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("col-sm-6", "col-md-4", "col-lg-3");

    const card = document.createElement("div");
    card.id = movie.id;
    card.classList.add("card", "mb-4");

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = movie.poster_path
      ? imgURL + movie.poster_path
      : "http://via.placeholder.com/500x750";
    img.alt = movie.title;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const movieTitle = document.createElement("h5");
    movieTitle.classList.add("card-title");
    movieTitle.textContent = movie.title;

    const movieRating = document.createElement("span");
    movieRating.classList.add(
      "card-rating",
      "green",
      `${voteColor(movie.vote_average)}`
    );
    if (Number.isInteger(movie.vote_average)) {
      movieRating.textContent = movie.vote_average;
    } else {
      movieRating.textContent = movie.vote_average.toFixed(1);
    }
    // movieRating.textContent = movie.vote_average;
    movieTitle.appendChild(movieRating);

    const movieOverview = document.createElement("p");
    movieOverview.classList.add("card-text");
    movieOverview.textContent = movie.overview;

    cardBody.appendChild(movieTitle);
    cardBody.appendChild(movieOverview);

    card.appendChild(img);
    card.appendChild(cardBody);

    movieContainer.appendChild(card);

    movieList.appendChild(movieContainer);

    document.getElementById(card.id).addEventListener("click", () => {
      console.log(card.id);
      openNav(movie);
    });
  });
}

const overlayContent = document.getElementById("overlay-content");
/* Open */
function openNav(movie) {
  let id = movie.id;
  overlayContent.innerHTML = fetch(
    originURL + "/movie/" + id + "/videos?" + apiKey
  )
    .then((res) => res.json())
    .then((videoDisplay) => {
      console.log(videoDisplay);
      if (videoDisplay) {
        document.getElementById("myNav").style.height = "100%";
        if (videoDisplay.results.length > 0) {
          // there is a possibility that there are no videos for certain movies, so this is to check that condition
          let videoEmbed = [];
          videoDisplay.results.forEach((video) => {
            if (video.site == "YouTube") {
              videoEmbed.push(
                `<iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" title="${video.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
              );
            }
          });

          overlayContent.innerHTML = videoEmbed.join("");
        } else {
          overlayContent.innerHTML = `<h1 class= 'no-movie-message'>No videos found.</h1>`;
        }
      }
    });
}

/* Close */
function closeNav() {
  document.getElementById("myNav").style.height = "0%";
}

function voteColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}
