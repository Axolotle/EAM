import { prefetchAudioFile } from '@/utils'


export default {
  state: () => ({
    ep: undefined,
    nextEp: localStorage.getItem('next-ep') === 'null' ? null : parseInt(localStorage.getItem('next-ep')) || 0,
    prevEpDate: new Date(localStorage.getItem('prev-ep-date') || Date.now() - 1),
    nextEpDate: new Date(localStorage.getItem('next-ep-date') || Date.now() - 1),
    delayMultiplier: 7 * 24,
    finished: localStorage.getItem('finished') === 'true',
    recordDuration: 60000
  }),

  mutations: {
    'SET_DEBUG_VALUES' (state, values) {
      for (const [key, value] of Object.entries(values)) {
        state[key] = value
      }
    },

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
    },

    'SET_FINISHED' (state, { finished, updateState = false }) {
      localStorage.setItem('finished', finished)
      if (updateState) {
        state.finished = finished
      }
    }
  },

  actions: {
    'DEFINE_NEXT_EP' ({ commit, state }, { temp = false } = {}) {
      const ep = state.ep
      let nextEp = ep + 1
      let nextEpDate = null
      let now = Date.now()
      if (nextEp <= 4) {
        nextEpDate = new Date(now + nextEp * 30000)
      } else {
        nextEp = null
        commit('SET_FINISHED', { finished: true, updateState: !temp })
      }
      now = new Date(now)
      commit('SET_NEXT_EP_STORAGE', { nextEp, nextEpDate: nextEpDate || now, prevEpDate: now })
      if (!temp) {
        commit('SET_NEXT_EP', { nextEp, nextEpDate: nextEpDate || now, prevEpDate: now })
      }
    },

    'PREFETCH_EPISODE' (store, ep) {
      return prefetchAudioFile(`/episodes/AEM-${ep}.ogg`)
    },

    'RESET_EPISODE' ({ commit, dispatch }) {
      localStorage.clear()
      localStorage.setItem('finished', true)
      window.location.reload()
    },

    'RESTORE_FINISHED' ({ state }) {
      localStorage.clear()
      localStorage.setItem('finished', true)
      localStorage.setItem('next-ep', null)
      localStorage.setItem('headphone', state.headphone)
      window.location.reload()
    }
  },

  getters: {
    episode: state => state.ep,
    nextEp: state => state.nextEp,
    nextEpDate: state => state.nextEpDate,
    recordDuration: state => state.recordDuration,
    finished: state => state.finished
  }
}
