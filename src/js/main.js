import Swiper from 'swiper';
import 'swiper/css';

let musics = [];
let genres = [];

const getData = async () => {
    try {
        const response = await fetch("/data/musics.json");

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        musics = await response.json();
        genres = [...new Set(musics.map(music => music.genre))];

    } catch (error) {
        console.error("Failed to load musics data:", error);
    }
};

const slider = (musics, className) => {
    const sliderContainer = document.querySelector(`${className} .swiper-wrapper`);
    musics.forEach((music) => {
        sliderContainer.insertAdjacentHTML("beforeend", `
            <div class="swiper-slide music-card w-50">
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
        slidesPerView: 1.15,
        spaceBetween: 30,
        breakpoints: {
            380: {slidesPerView: 1.55},
            640: {slidesPerView: 2.60},
            768: {slidesPerView: 3.09},
            1024: {slidesPerView: 4.12},
            1280: {slidesPerView: 5.25},
            1536: {slidesPerView: 6.38},
        }
    });
};