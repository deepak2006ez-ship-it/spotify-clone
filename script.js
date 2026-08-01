
let currentSong = new Audio();
let musicPath;
let currFolder;
let songs;
let songIdx;
let songName;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    mins = String(mins).padStart(2, "0");
    secs = String(secs).padStart(2, "0");

    return `${mins}:${secs}`;
}
async function getAlbums() {
    let response = await fetch("/album/album.json");
    let data = await response.json();
    console.log(data);
    for (const album of data) {        
            let folderName = album.folder
            let bgLoad = await fetch(`/album/${folderName}/albumCover/image.jpg`)
            let info = await fetch(`/album/${folderName}/albumDetail/info.json`)
            let data = await info.json();


            let cardAdd = document.querySelector(".cardContainer")
            cardAdd.innerHTML = cardAdd.innerHTML + `
            <div class="card rounded"  data-folder-name=${data.folderName}>
                        <button class="playBtn">
                            <svg viewBox="0 0 64 64" width="54" height="54">
                                <circle cx="32" cy="32" r="30" fill="#1DB954" />
                                <path d="M26 20 L26 44 L46 32 Z" fill="#000" />
                            </svg>
                        </button>
                        <img class="rounded" src="${bgLoad.url}"
                            alt="">
                        <h2>${data.title}</h2>
                        
                    </div>
            `


        


    }
    currFolder;
    let cards = document.querySelector(".cardContainer").querySelectorAll(".card");
    for (let card of cards) {
        card.addEventListener("click", async () => {
            currFolder = card.dataset.folderName;
            let loadMusic = await fetch(`/album/${currFolder}/musicList/song.json`)
            songs = await loadMusic.json();

            console.log(songs)
            
            let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

            songUL.replaceChildren();
            for (const song of songs) {

                let songNamez = song.replace(".mp3", "").replace(/[0-9]/g, "").replaceAll("-", " ")
                songUL.innerHTML += ` <li>
                            <div class="musicCard flex">
                                <div class="musicImg">
                                    <img class="invert"  src="music.svg" alt="">
                                </div>
                                <div class="infoMusic" data-folder-music-path=${song}>
                                    <span>${songNamez}</span><br>
                                  
                                </div>
                                <div class="musicCardPlay">
                                    <img class="invert" src="play.svg" alt="">
                                </div>

                            </div>
                        </li>

        `



            }
            let folderEvent = document.querySelector(".songList").getElementsByTagName("ul")[0].querySelectorAll("li");
            for (let indexz = 0; indexz < folderEvent.length; indexz++) {

                folderEvent[indexz].addEventListener("click", () => {
                    musicPath = folderEvent[indexz].querySelector(".infoMusic").dataset.folderMusicPath
                    playMusic(currFolder, musicPath);



                })

            }



        })
    }

}

const playMusic = (currFolder, musicPath) => {
    currentSong.src = `/album/${currFolder}/musicList/${musicPath}`
    currentSong.play();

    document.querySelector(".songInfo").innerHTML = musicPath;
    let state = document.getElementById("play")
    state.src = "pause.svg";


}
async function main(params) {

    getAlbums();
    let state = document.getElementById("play")





    state.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            state.src = "pause.svg";
        } else {
            currentSong.pause()
            state.src = "play.svg";
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songDuration").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100) + "%";
    })


    document.querySelector(".seekBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration / 100) * percent;

    })


    document.querySelector(".hamburger").addEventListener("touchstart", () => {
        document.querySelector(".left").style.left = "0";
        document.querySelector(".cross").style.display = "block";
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
        document.querySelector(".cross").style.display = "none"
    })
    document.getElementById("previous").addEventListener("click", () => {
        let index = songs.indexOf(musicPath);
        if (index > 0) {
            --index;
            playMusic(currFolder, songs[index]);
            musicPath = songs[index]
        }


    })
    document.getElementById("next").addEventListener("click", () => {
        let index = songs.indexOf(musicPath)
        if (index < songs.length - 1) {
            ++index;
            playMusic(currFolder, songs[index]);
            musicPath = songs[index]
        }

    })
    const volumeSlider = document.querySelector(".volumeSlider")
    volumeSlider.addEventListener("input", () => {
        currentSong.volume = volumeSlider.value / 100;
    })
    const songFun = document.querySelector(".volumeIconImg")
    let count = 0;
    songFun.addEventListener("click", () => {
        if (count % 2 == 0) {
            songFun.src = "mute.svg";
            currentSong.volume = 0;
        } else {
            songFun.src = "volume.svg";
            currentSong.volume = 1;
        }
        count++;

    })

}
main();   