export default class Recording {
  constructor (stream) {
    this.recorder = new MediaRecorder(stream)
    this.audio = null

    this.recorder.ondataavailable = e => {
      this.audio = e.data
    }
  }

  run (timer) {
    return new Promise(resolve => {
      this.recorder.start()
      setTimeout(() => {
        this.recorder.stop()
        this.recorder.stream.getAudioTracks()[0].stop()
      }, timer)
      this.recorder.onstop = resolve
    })
  }

  getPlayer () {
    const elem = document.createElement('AUDIO')
    const url = window.URL.createObjectURL(this.audio)
    elem.setAttribute('controls', true)
    elem.src = url
    return elem
  }

  upload () {
    const data = new FormData()
    data.append('file', this.audio)
    fetch('/upload/', {
      method: 'POST',
      body: data
    }).catch(err => {
      console.log(err)
    })
  }

  static askPermission () {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => resolve(new Recording(stream)))
          .catch(() => reject(new Error('NotAllowed')))
      } else {
        reject(new Error('NotImplemented'))
      }
    })
  }
}
