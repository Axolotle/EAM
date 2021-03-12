export default {
  state: () => ({
    ep: undefined,
    nextEp: parseInt(localStorage.getItem('next-ep')) || 0,
    nextEpDate: new Date(localStorage.getItem('next-ep-date') || Date.now() - 1000),
    delayMultiplier: 7 * 24,
    recordDuration: 2000
  }),

  mutations: {
    'SET_EPISODE' (state, int) {
      state.ep = int
    },

    'SET_NEXT_EP' (state, { nextEp, date }) {
      state.nextEp = nextEp
      state.nextEpDate = date
      localStorage.setItem('next-ep', nextEp)
      localStorage.setItem('next-ep-date', date.toISOString())
    }
  },

  actions: {
    'DEFINE_NEXT_EP' ({ commit, state }) {
      const ep = state.ep
      let nextEp = ep + 1
      let date = Date.now()
      if (nextEp <= 4) {
        const delay = (Math.pow((ep + 1) / 4, 1.5) - Math.pow(ep / 4, 1.5)) * state.delayMultiplier
        date = new Date(date + delay * 3600000)
      } else {
        nextEp = null
      }
      commit('SET_NEXT_EP', { nextEp, date })
    },

    'PREFETCH_EPISODE' (store, ep) {
      return new Promise(resolve => {
        const audio = new Audio(`/static/assets/episodes/AEM-${ep}.ogg`)
        audio.muted = true
        audio.addEventListener('canplaythrough', resolve(audio))
      })
    }
  },

  getters: {
    episode: state => state.ep,
    nextEp: state => state.nextEp,
    nextEpDate: state => state.nextEpDate,

    recordDuration: state => state.recordDuration
  }
}
