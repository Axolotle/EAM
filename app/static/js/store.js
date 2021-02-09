import { formatText } from './utils.js'
import debug from './debug.js'

export default {
  record_timer: debug.active ? 2000 : 60000,
  delayMultiplier: 7 * 24,
  // json data
  episodes: null,
  acknowledgment: null,
  streetIntro: null,

  get played () {
    return parseInt(localStorage.getItem('played')) || -1
  },
  set played (value) {
    localStorage.setItem('played', value)
  },

  get episode () {
    return parseInt(localStorage.getItem('episode')) || 0
  },
  set episode (value) {
    localStorage.setItem('episode', value)
  },

  get nextEpDate () {
    const nextEpDate = localStorage.getItem('nextEpDate')
    if (!nextEpDate) return new Date(Date.now() - 1000)
    return new Date(nextEpDate)
  },
  set nextEpDate (date) {
    localStorage.setItem('nextEpDate', date.toISOString())
  },

  get canPlayEpisode () {
    return this.episode < 5 && (this.played < this.episode && this.nextEpDate <= new Date())
  },

  defineNextEpisodeDate () {
    const ep = this.episode
    this.played = ep
    const delay = (Math.pow((ep + 1) / 4, 1.5) - Math.pow(ep / 4, 1.5)) * this.delayMultiplier
    const today = Date.now()
    const date = new Date(today + delay * 3600000)
    this.nextEpDate = date
    this.episode++

    debug.displayDelaySetup(new Date(today), date, delay / 24)
  },

  // INIT

  init () {
    return new Promise(resolve => {
      fetch('/static/assets/data.json').then(resp => resp.json()).then(texts => {
        for (const key in texts) {
          const data = texts[key]
          if (key === 'episodes') {
            for (const i in data) {
              data[i] = data[i].map(txt => formatText(txt)).join('')
            }
            this[key] = data
          } else {
            this[key] = formatText(data)
          }
        }
        resolve()
      })
    })
  }
}
