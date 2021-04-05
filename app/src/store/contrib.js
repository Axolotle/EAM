import { prefetchAudioFile } from '@/utils'
import AudioDispenser from '@/store/audioDispenser'


export default {
  state: {
    contribs: null
  },

  mutations: {
    'SET_CONTRIBS' (state, contribs) {
      state.contribs = contribs
    }
  },

  actions: {
    'PREFETCH_LOOP' (store) {
      return prefetchAudioFile('/misc/loop.ogg', { loop: true })
    },

    'SEND_CONTRIB' (store, blob) {
      const data = new FormData()
      data.append('file', blob)
      return fetch('/api/upload/', {
        method: 'POST',
        body: data
      })
    },

    'GET_CONTRIBS' ({ state, commit }) {
      return fetch('api/contributions').then(resp => resp.json()).then(contribs => {
        commit('SET_CONTRIBS', contribs.contribs)
        return state.contribs
      })
    },

    'GET_AUDIO_DISPENSER' ({ dispatch }) {
      return dispatch('GET_CONTRIBS').then(contribs => {
        return new AudioDispenser(contribs)
      })
    }
  },

  getters: {
    contribs: state => state.contribs
  }
}
