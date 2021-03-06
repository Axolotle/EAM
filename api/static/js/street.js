import { getRandInt, easeInOutQuad, prefetchAudioFile } from './utils.js'
import debug from './debug.js'

const messages = {
  filenames: undefined,
  i: undefined,
  _generator: undefined,

  async * generator (i = -1) {
    while (this.i > i) {
      yield await prefetchAudioFile('/originals/' + this.filenames[this.i--], { volume: 0 })
      if (this.i === -1) {
        this.i = this.filenames.length - 1
      }
    }
  },

  fetchAudioFilenames () {
    return fetch('/contributions').then(resp => resp.json()).then(data => data.contribs)
  },

  async init () {
    this.filenames = await this.fetchAudioFilenames()
    this.i = this.filenames.length - 1
    this._generator = this.generator()
  },

  [Symbol.asyncIterator] () {
    return this._generator
  },

  next (count) {
    if (count) {
      const stopAt = this.i - count
      return this.generator(stopAt > -1 ? stopAt : -1)
    } else {
      return this._generator.next().then(({ value }) => value)
    }
  }
}


export default class Street {
  constructor () {
    this.messages = []
    this.r = 30
    this.size = 100
    this.start = null
  }

  async init () {
    await messages.init()

    const audio = await messages.next()
    this.messages.push(new Message(audio, getRandInt(-this.r / 2, this.r / 2)))
    for await (const audio of messages.next(2)) {
      this.messages.push(new Message(audio, this.getPos()))
    }

    window.addEventListener('wheel', this.onWheel.bind(this))

    this.animate(0)
  }

  onWheel (e) {
    const dir = e.deltaY < 0 ? 1 : -1
    this.animate(dir)
  }

  animate (dir) {
    this.messages.forEach(msg => {
      let pos = msg.pos + dir
      if (pos < -this.size || pos > this.size) {
        pos = this.getPos()
      }
      msg.pos = pos
      msg.update()
    })
    debug.displaySvg(this.messages)
  }

  getPos () {
    const s = this.size
    const r = this.r
    const pos = getRandInt(-s, s)
    if (pos >= -r && pos <= r) {
      return this.getPos()
    } else if (this.pointIsTooClose(pos)) {
      return this.getPos()
    }
    return pos
  }

  pointIsTooClose (p) {
    return !this.messages.every(({ pos }) => {
      return Math.abs(pos - p) > this.r * 1.5
    })
  }
}


class Message {
  constructor (audio, pos) {
    this.audio = audio
    this.pos = pos
  }

  start () {
    this.audio.play()
    this.audio.addEventListener('ended', async () => {
      this.audio = await messages.next()
      this.update()
    })
  }

  update () {
    if (this.audio === undefined) return

    let volume = 0
    const distanceFromCenter = Math.abs(this.pos)
    if (distanceFromCenter <= 30) {
      if (this.audio.paused) {
        this.start()
      }
      volume = easeInOutQuad(1 - distanceFromCenter / 30)
    }
    this.audio.volume = volume
  }
}
