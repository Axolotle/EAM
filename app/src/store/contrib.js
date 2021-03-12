export default {
  state: () => ({
  }),

  mutations: {
  },

  actions: {
    'PREFETCH_LOOP' (store) {
      return new Promise(resolve => {
        const audio = new Audio('/static/assets/misc/loop.ogg')
        audio.addEventListener('canplaythrough', resolve(audio))
      })
    },

    'SEND_CONTRIB' (store, blob) {
      const data = new FormData()
      data.append('file', blob)
      return fetch('/api/upload/', {
        method: 'POST',
        body: data
      })
    }
  },

  getters: {
  }
}
