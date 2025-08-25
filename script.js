function decode(track){
    let name=track
    name=name.replace("http://127.0.0.1:3000/songs/","");
    name=name.replaceAll("%20"," ")
    name=name.replace(".mp3","")
    return name

}
function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds); // convert float to int

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}
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
    let play = document.getElementById('play')
    let pause = document.getElementById('pause')
    play.addEventListener('click', () => {
        audio.play();
        play.style.display = 'none';
        pause.style.display = 'block';
    })
    pause.addEventListener('click', () => {
        audio.pause();
        play.style.display = 'block';
        pause.style.display = 'none';
    })
    cards.forEach(card => {
        let index = card.getAttribute('data-index');
        let playBtn = card.querySelector('.play-popup');
        let pauseBtn = card.querySelector('.pause-popup');
        audio.addEventListener("timeupdate",()=>{
                let t=formatTime(audio.currentTime)
                let tt=formatTime(audio.duration)
                document.querySelector(".songtime").innerHTML=`${t} / ${tt}`
                document.querySelector(".circle").style.left=((audio.currentTime/audio.duration)*100)+'%'
                document.querySelector(".seekbar").addEventListener("click",(e)=>{
                    let precent=(e.offsetX/e.target.getBoundingClientRect().width)*100
                    document.querySelector(".circle").style.left=precent+'%'
                    audio.currentTime=(audio.duration*precent)/100
        })
        })
        
        playBtn.addEventListener('click', () => {
            if (currind != index) {
                audio.pause();
                audio.src = songs[index];
                currind = index
            }
            audio.play();
            let currsong = ""
            currsong = songs[index]
            document.querySelector(".songinfo").innerHTML = decode(currsong)  
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
            play.style.display = 'none';
            pause.style.display = 'block';

        });
        
        pauseBtn.addEventListener('click', () => {
            audio.pause();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline';
            play.style.display = 'block';
            pause.style.display = 'none';
        });


        audio.onended = () => {
            playBtn.style.display = 'inline';
            pauseBtn.style.display = 'none';
        };


        card.addEventListener('mouseenter', () => {
            playBtn.style.display = 'block';
        });

        card.addEventListener('mouseleave', () => {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'none'
        });
    });


}
main()
