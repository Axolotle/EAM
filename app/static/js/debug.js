import store from './store.js'

export default {
  active: window.location.pathname === '/debug',

  fracDayToString (delay) {
    const days = Math.floor(delay)
    const hoursFrac = (delay - days) * 24
    const hours = Math.floor(hoursFrac)
    const minsFrac = (hoursFrac - hours) * 60
    const mins = Math.floor(minsFrac)
    const secs = Math.round((minsFrac - mins) * 60)
    return `${days} j, ${hours} h, ${mins} m, ${secs} s`
  },

  displayDelaySetup (today, date, delay) {
    if (!this.active) return

    if (store.episode > 4) {
      console.log(`
C'était le dernier épisode.
      `)
    } else {
      console.log(`
Le prochain episode sera le numéro "${store.episode}".
Il sera disponible dans ${this.fracDayToString(delay)}.
Nous sommes le ${today.toLocaleString()}.
Alors l'épisode sera dispo le ${date.toLocaleString()}.
      `)
    }
  },

  displayDelayToWaitInConsole () {
    if (!this.active) return

    const date = store.nextEpDate
    const today = new Date()
    const delay = (date - today) / 3600000 / 24
    const nextContent = `Le prochain episode est le numéro "${store.episode}".`
    if (store.episode > 4) {
      console.log(`
Vous avez écouté tous les épisodes.
      `)
    } else if (delay <= 0) {
      console.log(`
${nextContent}
      `)
    } else {
      console.log(`
${nextContent}
Il sera disponible dans ${this.fracDayToString(delay)}.
Nous sommes le ${today.toLocaleString()}.
Alors l'épisode sera dispo le ${date.toLocaleString()}.
      `)
    }
  },

  displayDelayToWait () {
    if (!this.active) return

    const date = store.nextEpDate
    const today = new Date()
    const delay = (date - today) / 3600000 / 24
    document.querySelector('main').innerHTML = `
<p class="debug">
DEBUG:<br>
Le prochain episode est le numéro "${store.episode}".<br>
Il sera disponible dans ${this.fracDayToString(delay)}.<br>
Nous sommes le ${today.toLocaleString()}.<br>
Alors l'épisode sera dispo le ${date.toLocaleString()}.<br>
<br>
<a href="#">Passer le délai</a>
</p>`
    document.querySelector('a').onclick = () => {
      store.nextEpDate = new Date(Date.now())
      window.location.reload()
    }
  },

  listenForReset () {
    if (!this.active) return

    window.addEventListener('keydown', e => {
      if (e.key === 'R' && e.shiftKey) {
        localStorage.clear()
        window.location.reload()
      }
    })
  },

  allowSkip (audio, btn) {
    btn.parentElement.classList.remove('hidden')
    btn.onclick = () => {
      audio.currentTime = audio.duration - 10
    }
  }
}
