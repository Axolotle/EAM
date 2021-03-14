import { prefetchAudioFile } from '@/utils'


export default {
  state: () => ({
    ep: undefined,
    nextEp: parseInt(localStorage.getItem('next-ep')) || 0,
    prevEpDate: new Date(localStorage.getItem('prev-ep-date') || Date.now() - 1),
    nextEpDate: new Date(localStorage.getItem('next-ep-date') || Date.now() - 1),
    delayMultiplier: 7 * 24,
    recordDuration: 2000
  }),

  mutations: {
    'SET_EPISODE' (state, int) {
      state.ep = int
    },

    'SET_NEXT_EP' (state, { nextEp, nextEpDate, prevEpDate }) {
      state.nextEp = nextEp
      state.nextEpDate = nextEpDate
      state.prevEpDate = prevEpDate
    },

    'SET_NEXT_EP_STORAGE' (state, { nextEp, nextEpDate, prevEpDate }) {
      localStorage.setItem('next-ep', nextEp)
      localStorage.setItem('next-ep-date', nextEpDate.toISOString())
      localStorage.setItem('prev-ep-date', prevEpDate.toISOString())
    }
  },

  actions: {
    'DEFINE_NEXT_EP' ({ commit, state }, { temp = false } = {}) {
      const ep = state.ep
      let nextEp = ep + 1
      let nextEpDate = null
      let now = Date.now()
      if (nextEp <= 4) {
        const delay = (Math.pow((ep + 1) / 4, 1.5) - Math.pow(ep / 4, 1.5)) * state.delayMultiplier
        nextEpDate = new Date(now + delay * 3600000)
      } else {
        nextEp = null
      }
      now = new Date(now)
      commit('SET_NEXT_EP_STORAGE', { nextEp, nextEpDate: nextEpDate || now, prevEpDate: now })
      if (!temp) {
        commit('SET_NEXT_EP', { nextEp, nextEpDate: nextEpDate || now, prevEpDate: now })
      }
    },

    'PREFETCH_EPISODE' (store, ep) {
      return prefetchAudioFile(`/episodes/AEM-${ep}.ogg`)
    }
  },

  getters: {
    episode: state => state.ep,
    nextEp: state => state.nextEp,
    nextEpDate: state => state.nextEpDate,
    recordDuration: state => state.recordDuration
  }
}
