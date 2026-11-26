import Swiper from 'swiper';
import 'swiper/css';

let musics = [];
let currentMusicId;
let genres = [];
let currentGenre = "";
const swiperInstances = {};

document.addEventListener("error", (event) => {
    if (!(event.target instanceof HTMLImageElement)) return;

    const image = event.target;
    const fallback = image.nextElementSibling;
    const imageFilter = fallback?.nextElementSibling;

    if (!fallback?.classList.contains("music-cover-fallback")) return;

    image.classList.add("hidden");
    fallback?.classList.remove("hidden");
    imageFilter?.classList.remove("bg-black/25");

}, true);

const getData = async () => {
    try {
        const response = await fetch("/data/musics.json");

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        musics = await response.json();

        if (musics.length === 0) {
            console.warn("No music data found.");
            return false;
        }

        genres = [...new Set(musics.map(music => music.genre))].sort();
        currentGenre = genres[0];

        return true;
    } catch (error) {
        console.error("Failed to load musics data:", error);

        return false;
    }
};

const resetCover = (image) => {
    const fallback = image.nextElementSibling;
    const imageFilter = fallback?.nextElementSibling;

    image.classList.remove("hidden");
    fallback?.classList.add("hidden");
    imageFilter?.classList.add("bg-black/25");
};

const playMusic = (id) => {
    const audioTag = document.querySelector("#music-player")
    const musicPlayer = document.querySelector(".music-player")
    const musicId = document.querySelector(".music-player .music-id")
    const musicCardMobileCover = document.querySelector(".music-player .music-card-mobile .music-cover img")
    const musicCardMobileName = document.querySelector(".music-player .music-card-mobile .music-name")
    const musicCardDesktopCover = document.querySelector(".music-player .music-card-desktop .music-cover img")
    const musicCardDesktopName = document.querySelector(".music-player .music-card-desktop .music-name")
    const footer = document.querySelector("footer")

    const music = musics.find(music => music.id === id );

    currentMusicId = id;

    resetCover(musicCardMobileCover);
    resetCover(musicCardDesktopCover);

    audioTag.src = music.audio;
    musicId.value = music.id;
    musicCardMobileCover.src = music.cover;
    musicCardMobileName.firstElementChild.textContent = music.title;
    musicCardMobileName.lastElementChild.textContent = music.genre;
    musicCardDesktopCover.src = music.cover;
    musicCardDesktopName.firstElementChild.textContent = music.title;
    musicCardDesktopName.lastElementChild.textContent = music.genre;
    musicPlayer.classList.remove("hidden");
    footer.classList.add("mb-40");
    footer.classList.add("lg:mb-20");

};

const musicPlayer = () => {
    const audioTag = document.querySelector("#music-player");
    const musicProgress = document.querySelector(".music-player .music-progress input");
    const musicControlsPrevious = document.querySelector(".music-player .music-controls .previous");
    const musicControlsPlay = document.querySelector(".music-player .music-controls .play");
    const musicControlsPause = document.querySelector(".music-player .music-controls .pause");
    const musicControlsNext = document.querySelector(".music-player .music-controls .next");
    const musicVolumeUnmute = document.querySelector(".music-player .volume .unmute");
    const musicVolumeMute = document.querySelector(".music-player .volume .mute");
    const musicVolumeProgress = document.querySelector(".music-player .volume .volume-progress");
    const musicCurrentTimeMobile = document.querySelector(".music-player .time-mobile .current");
    const musicDurationMobile = document.querySelector(".music-player .time-mobile .duration");
    const musicCurrentTimeDesktop = document.querySelector(".music-player .time-desktop .current");
    const musicDurationDesktop = document.querySelector(".music-player .time-desktop .duration");

    const startPlayback = async () => {
        try {
            await audioTag.play();
        } catch (error) {
            console.error("Failed to play audio:", error);
            updatePlaybackUI(false);
        }
    };

    const updatePlaybackUI = (isPlaying) => {
        musicControlsPlay.classList.toggle("hidden", isPlaying);
        musicControlsPause.classList.toggle("hidden", !isPlaying);
    };

    musicProgress.addEventListener("change", () => {audioTag.currentTime = (musicProgress.value/100)*audioTag.duration})

    musicControlsPrevious.addEventListener("click", () => {
        currentMusicId -= 1;
        if (currentMusicId === 0) currentMusicId = musics.length
        playMusic(currentMusicId)
    })

    musicControlsNext.addEventListener("click", () => {
        currentMusicId += 1;
        if (currentMusicId > musics.length) currentMusicId = 1
        playMusic(currentMusicId)
    })

    musicControlsPlay.addEventListener("click", startPlayback)

    musicControlsPause.addEventListener("click", () => {audioTag.pause()})

    musicVolumeUnmute.addEventListener("click", () => {
        musicVolumeUnmute.classList.toggle("hidden")
        musicVolumeMute.classList.toggle("hidden")
        audioTag.muted = true
    })

    musicVolumeMute.addEventListener("click", () => {
        musicVolumeUnmute.classList.toggle("hidden")
        musicVolumeMute.classList.toggle("hidden")
        audioTag.muted = false
    })

    musicVolumeProgress.addEventListener("input", () => {audioTag.volume = musicVolumeProgress.value/10})

    audioTag.addEventListener("loadedmetadata", () => {
        musicCurrentTimeMobile.textContent = timeFormat(audioTag.currentTime);
        musicDurationMobile.textContent = timeFormat(audioTag.duration);
        musicCurrentTimeDesktop.textContent = timeFormat(audioTag.currentTime);
        musicDurationDesktop.textContent = timeFormat(audioTag.duration);
        musicProgress.value = (audioTag.currentTime/audioTag.duration)*100;
        startPlayback();
    });

    audioTag.addEventListener("timeupdate", () => {
        musicCurrentTimeMobile.textContent = timeFormat(audioTag.currentTime);
        musicCurrentTimeDesktop.textContent = timeFormat(audioTag.currentTime);
        musicProgress.value = (audioTag.currentTime/audioTag.duration)*100;
    });

    audioTag.addEventListener("play", () => {updatePlaybackUI(true)})

    audioTag.addEventListener("pause", () => {updatePlaybackUI(false)})

    audioTag.addEventListener("error", () => {
        console.error("Failed to load audio:", audioTag.error);
        updatePlaybackUI(false);
    });

    audioTag.addEventListener("ended", () => {
        currentMusicId += 1;
        if (currentMusicId > musics.length) currentMusicId = 1
        playMusic(currentMusicId)
    });

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
        searchResultTitle.textContent = "search for musics, genres, ...";
        searchInput.value = "";
    });
    searchInput.addEventListener("input", () => {
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
                                <div class="music-cover h-full relative py-3">
                                    <img class="h-full rounded-xl border border-slate-300" src="${music.cover}" alt="">
                                    <div class="music-cover-fallback w-full h-full aspect-square flex justify-center items-center rounded-xl border border-slate-300 bg-slate-900 group transition duration-400 hidden">  
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7f22fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eighth-notes preview-icon"><path d="M21 16V3a1 1 0 0 0-1.28-.96l-10 2.917a1 1 0 0 0-.72.96V19"/><circle cx="18" cy="16" r="3"/><circle cx="6" cy="19" r="3"/></svg>
                                    </div>
                                    <div class="music-cover-filter w-full aspect-square rounded-xl border border-slate-300 bg-black/25 absolute top-3"></div>
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
                    searchResultWrapper.lastElementChild.previousElementSibling.lastElementChild.lastElementChild.addEventListener("click", () => {playMusic(music.id)})
                })
            } else {
                searchResultWrapper.innerHTML = "";
                searchResultTitle.classList.remove("hidden");
                searchResultTitle.textContent = "No music matches your search";
            }
        } else {
            searchResultWrapper.innerHTML = "";
            searchResultTitle.classList.remove("hidden");
            searchResultTitle.textContent = "search for musics, genres, ...";
        }
    })
};

const musicSlider = (musics, className) => {
    const sliderContainer = document.querySelector(`${className} .swiper-wrapper`);
    if (swiperInstances[className]) {
        swiperInstances[className].destroy(true, true);
    }
    sliderContainer.innerHTML = "";
    musics.forEach((music) => {
        sliderContainer.insertAdjacentHTML("beforeend", `
            <div class="swiper-slide music-card w-60">
                <div class="music-cover relative w-full mb-2.5 aspect-square">
                    <img class="music-cover-img w-full rounded-xl border border-slate-300 contrast-125" src="${music.cover}" alt="">
                    <div class="music-cover-fallback w-full h-full flex justify-center items-center rounded-xl border border-slate-300 bg-slate-900 hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="#7f22fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eighth-notes preview-icon"><path d="M21 16V3a1 1 0 0 0-1.28-.96l-10 2.917a1 1 0 0 0-.72.96V19"/><circle cx="18" cy="16" r="3"/><circle cx="6" cy="19" r="3"/></svg>
                    </div>
                    <div class="music-cover-filter w-full h-full flex justify-center items-center rounded-xl border border-slate-300 bg-black/25 hover:bg-black/80 group absolute top-0 transition duration-400">
                        <span class="w-15 h-15 flex justify-center items-center rounded-full bg-violet-600 hover:bg-violet-900 cursor-pointer border border-white transition duration-400 opacity-0 group-hover:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#cad5e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play preview-icon"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>
                        </span>
                    </div>
                </div>
                <div class="music-name">${music.title}</div>
                <div class="music-name text-sm text-gray-400">${music.genre.toLowerCase()}</div>
            </div>
        `)
        sliderContainer.lastElementChild.firstElementChild.lastElementChild.lastElementChild.addEventListener("click", () => {playMusic(music.id)})
    })
    swiperInstances[className] = new Swiper(className, {
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

const timeFormat = (number) => {
    let minute = Math.floor(number/60);
    let seconds = Math.floor(number%60);
    if (seconds < 10) seconds = "0" + seconds
    return `${minute}:${seconds}`
};

const waitForImages = async () => {
    const images = [...document.images];

    await Promise.all(
        images.map((image) => {
            if (image.complete) return Promise.resolve();

            return new Promise((resolve) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
            });
        })
    );
};

const loadPage = async () => {
    try {
        const isDataLoaded = await getData();
        if (!isDataLoaded) return;
        musicPlayer()
        search()
        genresSlider()
        recentlyAddedSlider()
        trendingSlider()
        await waitForImages();
    } finally {
        document.querySelector(".loading").classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
    }
};

await loadPage();