
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
    let songs = await getSongs()
    console.log(songs)
    let audio = new Audio(songs[3]);

    let element = document.querySelector(".card");
    console.log(element)

    element.addEventListener("click", function () {

        let pause = document.getElementById("pause")
        let play = document.getElementById("play")

        if (audio.paused) {
            audio.play()
            play.style.display = "none"
            pause.style.display = "inline"

        }
        else {
            audio.pause()
            play.style.display = "inline"
            pause.style.display = "none"
        }

    });
    let card=document.querySelectorAll('.card')
    console.log(card)
    card.forEach(poster => {
        let playBtn = poster.querySelector('.play-popup');

        poster.addEventListener('mouseenter', () => {
            playBtn.style.display = 'block';
            playBtn.addEventListener("click", () => {
                playBtn.style.display = 'none'

            });
        });
        poster.addEventListener('mouseleave', () => {
            playBtn.style.display = 'none';
        });
    });


}
main()
