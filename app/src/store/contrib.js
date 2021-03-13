import { prefetchAudioFile } from '@/utils'
import AudioDispenser from '@/store/audioDispenser'


export default {
  state: () => ({
  }),

  mutations: {
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

    'GET_AUDIO_DISPENSER' () {
      return fetch('api/contributions').then(resp => resp.json()).then(data => {
        return new AudioDispenser(data.contribs)
      })
    }
  },

  getters: {
  }
}
