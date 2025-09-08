function decode(track){
    let name = track;
    name = name.replace("https://spotify-backend-58wa.onrender.com/songs/", "");
    name = decodeURIComponent(name.replace(".mp3", ""));
    return name;
}

function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

async function getSongs() {
    try {
        // Use your backend directly if it has CORS enabled
        let response = await fetch("https://spotify-backend-58wa.onrender.com/api/songs");
        if (!response.ok) throw new Error("Network response was not ok");
        let songs = await response.json();
        const baseUrl = "https://spotify-backend-58wa.onrender.com";
        return songs.map(song => baseUrl + song);
    } catch (err) {
        console.error("Failed to fetch songs:", err);
        return [];
    }
}

async function main() {
    let songs = await getSongs();
    if(songs.length === 0) {
        alert("Could not load songs. Check console for errors.");
        return;
    }

    let audio = new Audio();
    let cards = document.querySelectorAll('.card');
    let currind = null;

    const playBtnGlobal = document.getElementById('play');
    const pauseBtnGlobal = document.getElementById('pause');

    playBtnGlobal.addEventListener('click', () => {
        audio.play();
        playBtnGlobal.style.display = 'none';
        pauseBtnGlobal.style.display = 'block';
    });

    pauseBtnGlobal.addEventListener('click', () => {
        audio.pause();
        playBtnGlobal.style.display = 'block';
        pauseBtnGlobal.style.display = 'none';
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            document.querySelector(".songtime").innerHTML = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            let circle = document.querySelector(".circle");
            circle.style.left = ((audio.currentTime / audio.duration) * 100) + '%';
        }
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let rect = e.target.getBoundingClientRect();
        let percent = (e.offsetX / rect.width) * 100;
        audio.currentTime = (audio.duration * percent) / 100;
        document.querySelector(".circle").style.left = percent + '%';
    });

    cards.forEach((card, idx) => {
        let playBtn = card.querySelector('.play-popup');
        let pauseBtn = card.querySelector('.pause-popup');

        playBtn.addEventListener('click', () => {
            if(currind !== idx){
                audio.pause();
                audio.src = songs[idx];
                currind = idx;
            }
            audio.play();
            document.querySelector(".songinfo").innerHTML = decode(songs[idx]);
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            playBtnGlobal.style.display = 'none';
            pauseBtnGlobal.style.display = 'block';
        });

        pauseBtn.addEventListener('click', () => {
            audio.pause();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline';
            playBtnGlobal.style.display = 'block';
            pauseBtnGlobal.style.display = 'none';
        });

        audio.onended = () => {
            playBtn.style.display = 'inline';
            pauseBtn.style.display = 'none';
            playBtnGlobal.style.display = 'block';
            pauseBtnGlobal.style.display = 'none';
        };

        card.addEventListener('mouseenter', () => {
            if(currind !== idx) playBtn.style.display = 'block';
        });

        card.addEventListener('mouseleave', () => {
            if(currind !== idx) playBtn.style.display = 'none';
            pauseBtn.style.display = 'none';
        });
    });
}

main();
