const playPouseBtn = document.querySelector('.play-pause-btn')
const video = document.querySelector("video")
const videoContainer = document.querySelector(".video-container")
const theaterBtn = document.querySelector('.theater-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')



document.addEventListener("keydown", e => {
    const tagName = document.activeElement.tagName.toLowerCase()
    if (tagName === 'input') return
    switch (e.key.toLowerCase()) {
        case " ":
            if (tagName === 'button') return
        case "k":
            togglePlay()
            break;
        case 'f':
            toggleFullScreen()
            break
        case 't':
            toggleTheater()
            break
        case 'i':
            toggleMiniPlayer()
            break

    }
})
// Theater

theaterBtn.addEventListener('click', toggleTheater)

function toggleTheater() {
    videoContainer.classList.toggle('theater')
}

// Mini Player 
miniPlayerBtn.addEventListener('click', toggleMiniPlayer)

function toggleMiniPlayer() {
    if (videoContainer.classList.contains('mini-player')) {
        document.exitPictureInPicture()
    } else {
        video.requestPictureInPicture()
    }
}

video.addEventListener("enterpictureinpicture", () => [
    videoContainer.classList.add('mini-player')
])

video.addEventListener("leavepictureinpicture", () => [
    videoContainer.classList.remove('mini-player')
])
// Full Screen

fullScreenBtn.addEventListener('click', toggleFullScreen)

function toggleFullScreen() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

document.addEventListener('fullscreenchange', () => {
    videoContainer.classList.toggle('full-screen', document.fullscreenElement)
})

// Play/Pause

playPouseBtn.addEventListener('click', togglePlay)
video.addEventListener("click", togglePlay)

function togglePlay() {
    video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
    videoContainer.classList.remove("paused")
})

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused")
})

