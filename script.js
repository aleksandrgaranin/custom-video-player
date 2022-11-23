const playPouseBtn = document.querySelector('.play-pause-btn')
const video = document.querySelector("video")
const videoContainer = document.querySelector(".video-container")
const theaterBtn = document.querySelector('.theater-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')
const muteBtn = document.querySelector('.mute-btn')
const volumeSlider = document.querySelector('.volume-slider')
const currentTime = document.querySelector(".current-time")
const totalTime = document.querySelector(".total-time")
const captionsBtn = document.querySelector(".caption-btn")
const playbackSpeedBtn = document.querySelector(".speed-btn")




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
        case 'm':
            toggleMute()
            break
        case "arrowleft":
        case "j":
            skip(-5)
            break
        case "arrowright":
        case "r":
            skip(5)
            break
    }
})

// Playback Speed

playbackSpeedBtn.addEventListener("click", () => {
    let newPlaybackRate = video.playbackRate + .25
    if (newPlaybackRate > 2) newPlaybackRate = .25
    video.playbackRate = newPlaybackRate
    playbackSpeedBtn.textContent = `${newPlaybackRate}x`
})

// Captions

const captions = video.textTracks[0]
captions.mode = "hidden"

captionsBtn.addEventListener('click', () => {
    const isHidden = captions.mode === "hidden"
    captions.mode = isHidden ? "showing" : "hidden"
    videoContainer.classList.toggle('captions', isHidden)
})


// Duration
video.addEventListener('loadeddata', () => {
    totalTime.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate", () => {
    currentTime.textContent = formatDuration(video.currentTime)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
})

function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    }

}

function skip(duration) {
    video.currentTime += duration
}

// Volume
muteBtn.addEventListener('click', toggleMute)

volumeSlider.addEventListener('input', e => {
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute() {
    video.muted = !video.muted
}

video.addEventListener('volumechange', () => {
    volumeSlider.value = video.volume
    let volumeLevel
    if (video.muted || video.volume === 0) {
        volumeSlider.value = 0
        volumeLevel = "muted"
    } else if (video.volume >= .5) {
        volumeLevel = "high"
    } else {
        volumeLevel = "low"
    }
    videoContainer.dataset.volumeLevel = volumeLevel
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

