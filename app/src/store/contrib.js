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

    'SEND_CONTRIB' (store, { blob, duration }) {
      const data = new FormData()
      data.append('ps', process.env.VUE_APP_PS)
      data.append('file', blob)
      data.append('duration', duration)
      data.append('size', blob.size)
      return fetch('/api/upload/', {
        method: 'POST',
        body: data
      })
    },

    'REMOVE_CONTRIB' (store, filename) {
      const data = new FormData()
      data.append('filename', filename)
      data.append('ps', localStorage.getItem('ps'))
      return fetch('/api' + process.env.VUE_APP_REMOVE_ROUTE + '/', { method: 'DELETE', body: data }).then(response => {
        return response.ok
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
