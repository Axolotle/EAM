import { renderTemplate, clearScreen, sleep, prefetchAudioFile, play } from './utils.js'
import store from './store.js'
import debug from './debug.js'
import Recording from './recorder.js'


function displayIntro () {
  return new Promise(resolve => {
    const playBtn = renderTemplate('intro', { select: 'a', data: store })
    playBtn.onclick = resolve
  })
}


async function playEpisode () {
  renderTemplate('player')
  const episode = await prefetchAudioFile(`/episodes/AEM-${store.episode}.ogg`)
  store.defineNextEpisodeDate()
  return Promise.all([
    prefetchAudioFile('/misc/loop.ogg'),
    play(episode, debug.active)
  ]).then(([loop]) => loop)
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
  debug.displayDelayToWait()

  if (store.canPlayEpisode) {
    await displayIntro()
    clearScreen()
    await sleep(1000)
    const loop = await playEpisode()
    loop.play()

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
