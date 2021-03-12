import Vue from 'vue'
import Vuex from 'vuex'
import episode from './episode.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    component: undefined
  },

  mutations: {
    'SET_COMPONENT' (state, str) {
      state.component = str
    }
  },

  actions: {
    'INIT' ({ state, commit, dispatch }) {
      const { nextEp, nextEpDate } = state.episode
      if (nextEp <= 4 && nextEpDate <= new Date()) {
        commit('SET_EPISODE', nextEp)
        commit('SET_COMPONENT', 'episode')
      } else if (nextEp === null) {
        commit('SET_COMPONENT', 'street')
      }
    }
  },

  getters: {
    component: state => state.component
  },

  modules: {
    episode
  }
})
