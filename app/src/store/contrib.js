export default {
  state: () => ({
  }),

  mutations: {
  },

  actions: {
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
