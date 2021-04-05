import { prefetchAudioFile } from '@/utils'


export default class audioDispenser {
  constructor (filenames) {
    this.filenames = filenames
    this.nextIndex = filenames.length - 1
    this._generator = this.generator()
  }

  [Symbol.asyncIterator] () {
    return this._generator
  }

  async * generator (i = -1) {
    while (this.nextIndex > i) {
      yield await prefetchAudioFile('/contributions/' + this.filenames[this.nextIndex--], { volume: 0 })
      if (this.nextIndex === -1) {
        this.nextIndex = this.filenames.length - 1
      }
    }
  }

  next (count) {
    if (count) {
      const stopAt = this.nextIndex - count
      return this.generator(stopAt > -1 ? stopAt : -1)
    } else {
      return this._generator.next().then(({ value }) => value)
    }
  }
}
