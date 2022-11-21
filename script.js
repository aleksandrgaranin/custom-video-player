const playPouseBtn = document.querySelector('.play-pause-btn')
const video = document.querySelector("video")
const videoContainer = document.querySelector(".video-container")

playPouseBtn.addEventListener('click', togglePlay)

document.addEventListener("keydown", e => {
    switch (e.key.toLowerCase()) {
        case " ":
        case "k":
            togglePlay()
            break
    }
})

function togglePlay() {
    video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
    videoContainer.classList.remove("paused")
})

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused")
})