import store from './store.js'

export default {
  active: true,

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

  displayDelayToWait () {
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
  }
}
