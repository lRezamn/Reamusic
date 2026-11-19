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