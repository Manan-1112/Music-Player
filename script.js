
async function getSongs() {
    let song = await fetch("http://127.0.0.1:3000/songs/")
    let response = await song.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs

}
async function main() {
    let songs = await getSongs();
    let audio = new Audio();
    let cards = document.querySelectorAll('.card');
    let currind = null;
    let play=document.getElementById('play')
    let pause=document.getElementById('pause')
    play.addEventListener('click',()=>{
        audio.play();
        play.style.display='none';
        pause.style.display='block';
    })
    pause.addEventListener('click',()=>{
        audio.pause();
        play.style.display='block';
        pause.style.display='none';
    })
    cards.forEach(card => {
        let index = card.getAttribute('data-index');
        let playBtn = card.querySelector('.play-popup');
        let pauseBtn = card.querySelector('.pause-popup');
        let poster =card.querySelector('.poster')
        playBtn.addEventListener('click', () => {
            if (currind != index) {
                audio.pause();
                audio.src = songs[index];
                currind = index
            }
            audio.play();

            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            play.style.display='none';
            pause.style.display='block';

        });

        pauseBtn.addEventListener('click', () => {
            audio.pause();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline';
            play.style.display='block';
            pause.style.display='none';
        });


        audio.onended = () => {
            playBtn.style.display = 'inline';
            pauseBtn.style.display = 'none';
        };


        poster.addEventListener('mouseenter', () => {
            playBtn.style.display = 'block'; 
        });

        poster.addEventListener('mouseleave', () => {
            playBtn.style.display = 'none';
            pauseBtn.style.display='none'
        });
    });

}
main()
