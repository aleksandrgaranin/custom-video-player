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
const previewImg = document.querySelector(".preview-img")
const thumbnailImg = document.querySelector(".thumbnail-img")
const timeLineContainer = document.querySelector(".timeline-container")


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

// TimeLine

timeLineContainer.addEventListener("mousemove", handleTimelineUpdate)
timeLineContainer.addEventListener("mousedown", toggleScrubbing)

document.addEventListener("mouseup", e => {
    if (isScrubbing) toggleScrubbing(e)
})

document.addEventListener("mousemove", e => {
    if (isScrubbing) handleTimelineUpdate(e)
})


let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
    const rect = timeLineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    console.log(e.buttons)
    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
        wasPaused = video.paused
        video.pause()
    } else {
        video.currentTime = percent * video.duration
        if (!wasPaused) video.play()
    }

    handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
    const rect = timeLineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    const previewImgNumber = Math.max(1, Math.floor((percent * video.duration) / 10))
    const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
    previewImg.src = previewImgSrc
    console.log(previewImgSrc)
    timeLineContainer.style.setProperty("--preview-position", percent)

    if (isScrubbing) {
        e.preventDefault()
        thumbnailImg.src = previewImgSrc
        timeLineContainer.style.setProperty("--progress-position", percent)
    }
}


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
    const percent = video.currentTime / video.duration
    timeLineContainer.style.setProperty("--progress-position", percent)
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

