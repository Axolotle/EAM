import { renderTemplate, clearScreen, sleep } from './utils.js'
import store from './store.js'
import debug from './debug.js'
import Recording from './recorder.js'


function play (n) {
  return new Promise(resolve => {
    const audio = new Audio(`/static/assets/episodes/MAE-${n}.ogg`)
    console.log(`READING: MAE-${n}.ogg`)
    audio.addEventListener('canplaythrough', () => audio.play())
    audio.addEventListener('ended', resolve)
  })
}


function displayIntro () {
  return new Promise(resolve => {
    const playBtn = renderTemplate('intro', { select: 'a', data: store })
    playBtn.onclick = resolve
  })
}


async function playEpisode () {
  renderTemplate('player')
  // get ep before defining next one
  const ep = store.episode
  store.defineNextEpisodeDate()
  return play(ep)
}


function displayRecorder () {
  return new Promise((resolve, reject) => {
    const recordBtn = renderTemplate('record', { select: '#record-btn' })
    recordBtn.onclick = () => {
      Recording.askPermission().then(recording => {
        recording.run(store.record_timer).then(() => resolve(recording))
      }).catch(() => {
        clearScreen()
        resolve()
      })
    }
  })
}


function displayRecording (recording) {
  return new Promise(resolve => {
    const [uploadBtn, continueBtn] = renderTemplate('confirm-upload', { selectAll: 'a', data: store })

    // temp
    const player = recording.getPlayer()
    document.querySelector('main div div').appendChild(player)
    // endtemp

    uploadBtn.onclick = () => {
      recording.upload()
      resolve()
    }
    continueBtn.onclick = resolve
  })
}


function displayGarden () {
  console.log('Vous pouvez accéder au jardin.')
  renderTemplate('garden')
}


window.onload = async () => {
  await store.init()
  store.displayDelayToWait()
  debug.displayDelayToWait()

  if (store.canPlayEpisode) {
    await displayIntro()
    clearScreen()
    await sleep(1000)
    await playEpisode()

    const recording = await displayRecorder()
    if (recording) {
      await displayRecording(recording)
    }
  }

  if (store.episode > 4) {
    displayGarden()
  } else {
    clearScreen()
  }
}
