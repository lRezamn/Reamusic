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

const musicSlider = (musics, className) => {
    const sliderContainer = document.querySelector(`${className} .swiper-wrapper`);
    musics.forEach((music) => {
        sliderContainer.insertAdjacentHTML("beforeend", `
            <div class="swiper-slide music-card w-60">
                <div class="music-cover relative w-full mb-2.5">
                    <img class="w-full rounded-xl border border-slate-300 contrast-125" src="${music.cover}" alt="">
                    <div class="w-full h-full rounded-xl bg-black/25 absolute top-0"></div>
                    <div class="w-full h-full flex justify-center items-center rounded-xl bg-white/65 absolute top-0 hidden">
                        <span class="w-10 h-10 flex justify-center items-center rounded-full bg-violet-600 hover:bg-violet-900 cursor-pointer border border-white">
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
