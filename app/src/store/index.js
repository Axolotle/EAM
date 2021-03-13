import Vue from 'vue'
import Vuex from 'vuex'
import episode from './episode.js'
import contrib from './contrib.js'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    component: undefined,
    debug: false
  },

  mutations: {
    'SET_COMPONENT' (state, str) {
      state.component = str
    },

    'ACTIVATE_DEBUG' (state) {
      state.debug = true
    }
  },

  actions: {
    'INIT' ({ state, commit }, location) {
      if (window.location.pathname.includes('debug')) {
        commit('ACTIVATE_DEBUG')
      }
      const { nextEp, nextEpDate } = state.episode
      if (nextEp === null) {
        commit('SET_COMPONENT', 'street')
      } else if (nextEp <= 4 && nextEpDate <= new Date()) {
        commit('SET_EPISODE', nextEp)
        commit('SET_COMPONENT', 'episode')
      } else {
        commit('SET_COMPONENT', undefined)
      }
    }
  },

  getters: {
    component: state => state.component,
    debug: state => state.debug
  },

  modules: {
    episode,
    contrib
  }
})
