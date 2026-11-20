import Swiper from 'swiper';
import 'swiper/css';

let musics = [];
let genres = [];
let currentGenre = "";

const getData = async () => {
    try {
        const response = await fetch("/data/musics.json");

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        musics = await response.json();
        genres = [...new Set(musics.map(music => music.genre))].sort();
        currentGenre = genres[0]

    } catch (error) {
        console.error("Failed to load musics data:", error);
    }
};

const search = () => {
    const searchIcon = document.querySelector(".search-icon");
    const searchSection = document.querySelector("#search");
    const searchInput = document.querySelector("#search-input");
    const searchResultContainer = document.querySelector(".search-result");
    const searchResultTitle = document.querySelector(".search-result-title");
    const searchResultWrapper = document.querySelector(".search-result-wrapper");
    const searchResultCloseIcon = document.querySelector(".search-result-close-icon");
    let searchResult = [];
    searchIcon.addEventListener("click", () => {
        searchSection.scrollIntoView();
        searchInput.focus();
        searchResultContainer.classList.remove("hidden");
    });
    searchInput.addEventListener("click", () => {searchResultContainer.classList.remove("hidden")});
    searchResultCloseIcon.addEventListener("click", () => {
        searchResultContainer.classList.add("hidden")
        searchResultWrapper.innerHTML = "";
        searchResultTitle.classList.remove("hidden");
        searchResultTitle.innerHTML = "search for musics, genres, ...";
        searchInput.value = "";
    });
    searchInput.addEventListener("keyup", () => {
        if (searchInput.value.trim().length >= 3) {
            searchResult = musics.filter((music) => {
                return music.title.toLowerCase().indexOf(searchInput.value.toLowerCase().trim()) !== -1 || music.genre.toLowerCase().indexOf(searchInput.value.toLowerCase().trim()) !== -1
            })
            if (searchResult.length) {
                searchResultWrapper.innerHTML = "";
                searchResultTitle.classList.add("hidden")
                searchResult.forEach((music) => {
                    searchResultWrapper.insertAdjacentHTML("beforeend", `
                <div class="music-result h-25 flex justify-between items-center">
                    <div class="music-card h-full flex items-center">
                        <div class="music-cover h-full py-3">
                            <img class="h-full rounded-xl border-2 border-slate-300" src="${music.cover}" alt="">
                        </div>
                        <div class="music-name ml-5">
                            <span>${music.title}</span>
                            <br>
                            <span class="text-gray-400">${music.genre}</span>
                        </div>
                    </div>
                    <div class="play-btn">
                        <button class="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-900 transition duration-400 cursor-pointer">Play</button>
                    </div>
                </div>
                <hr>
            `)
                    searchResultWrapper.lastElementChild.previousElementSibling.lastElementChild.lastElementChild.addEventListener("click", () => {
                        console.log("play")
                    })
                })
            }
            else {
                searchResultWrapper.innerHTML = "";
                searchResultTitle.classList.remove("hidden");
                searchResultTitle.innerHTML = "No music matches your search";
            }
        }
    })
};

const musicSlider = (musics, className) => {
    const sliderContainer = document.querySelector(`${className} .swiper-wrapper`);
    sliderContainer.innerHTML = "";
    musics.forEach((music) => {
        sliderContainer.insertAdjacentHTML("beforeend", `
            <div class="swiper-slide music-card w-60">
                <div class="music-cover relative w-full mb-2.5">
                    <img class="w-full rounded-xl border border-slate-300 contrast-125" src="${music.cover}" alt="">
                    <div class="w-full h-full flex justify-center items-center rounded-xl bg-black/25 hover:bg-white/50 group absolute top-0 transition duration-400">
                        <span class="w-15 h-15 flex justify-center items-center rounded-full bg-violet-600 hover:bg-violet-900 cursor-pointer border border-white transition duration-400 opacity-0 group-hover:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#cad5e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play preview-icon"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>
                        </span>
                    </div>
                </div>
                <div class="music-name">${music.title}</div>
                <div class="music-name text-sm text-gray-400">${music.genre.toLowerCase()}</div>
            </div>
        `)
    })
    const swiper = new Swiper(className, {
        autoplay: false,
        slidesPerView: "auto",
        spaceBetween: 30,
        breakpoints: {
            320: {slidesPerView: 1.2},
            370: {slidesPerView: 1.3},
            420: {slidesPerView: 1.4},
            470: {slidesPerView: 1.6},
            520: {slidesPerView: 1.9},
            580: {slidesPerView: 2.2},
            640: {slidesPerView: 2.4},
            768: {slidesPerView: 2.9},
            1024: {slidesPerView: 3.9},
            1280: {slidesPerView: 4.8},
            1536: {slidesPerView: 5.4},
        }
    });
};

const genresSlider = () => {
    const genresContainer = document.querySelector(".genres .genres-text .genres-container")
    genresContainer.innerHTML = "";
    genres.forEach((genre) => {
        if (genre === currentGenre) {
            genresContainer.insertAdjacentHTML("beforeend", `
                  <div class="text-xs md:text-sm font-bold my-1 py-1 px-2 mx-2 border rounded-xl text-violet-600 border-violet-600 bg-violet-200 transition duration-300">${genre}</div>
        `)
        }
        else {
            genresContainer.insertAdjacentHTML("beforeend", `
                  <div class="text-xs md:text-sm font-bold my-1 py-1 px-2 mx-2 bg-white/20 border rounded-xl cursor-pointer hover:text-violet-600 hover:hover:border-violet-600 hover:bg-violet-200 transition duration-300">${genre}</div>
        `)
            genresContainer.lastElementChild.addEventListener("click",() => {
                currentGenre = genre
                genresSlider()
            })
        }
    })
    const genresSliderMusics = musics.filter((music) => {
        return music.genre === currentGenre
    })
    musicSlider(genresSliderMusics, ".genres-slider")

};

const recentlyAddedSlider = () => {
    const recentlyAddedSliderMusics = musics.toReversed().slice(0,9)
    musicSlider(recentlyAddedSliderMusics, ".recently-added-slider")
};

const trendingSlider = () => {
    const trendingSliderMusics = musics.toSorted((music1,music2) => {
        return music2.plays-music1.plays
    }).slice(0,9)
    musicSlider(trendingSliderMusics, ".trending-slider")
};

await getData()
genresSlider()
recentlyAddedSlider()
trendingSlider()
search()