import Vue from 'vue'
import Vuex from 'vuex'
import episode from './episode.js'
import contrib from './contrib.js'
import { sleep } from '@/utils'


Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    component: undefined,
    debug: false,
    animation: null
  }),

  mutations: {
    'ACTIVATE_DEBUG' (state) {
      state.debug = true
    },

    'SET_COMPONENT' (state, str) {
      state.component = str
    },

    'SET_ANIMATION' (state, { from, to, duration }) {
      state.animation = [
        [{ backgroundColor: from }, { backgroundColor: to }],
        { duration }
      ]
    }
  },

  actions: {
    'DEFINE_COMPONENT' ({ state, commit }) {
      const { nextEp, nextEpDate } = state.episode
      if (nextEp === null) {
        commit('SET_COMPONENT', 'street')
      } else if (nextEp <= 4 && nextEpDate <= new Date()) {
        commit('SET_EPISODE', nextEp)
        commit('SET_COMPONENT', 'episode')
      } else {
        commit('SET_COMPONENT', undefined)
      }
    },

    'DEFINE_BACKGROUND' ({ state, commit, dispatch }) {
      const { prevEpDate, nextEpDate, nextEp } = state.episode
      const now = Date.now()
      if (nextEp !== null && nextEpDate > now) {
        const max = nextEpDate - prevEpDate
        const curr = now - prevEpDate
        const delta = 255 - (curr / max * 255)
        dispatch('RUN_INITIAL_ANIMATION', [delta, nextEpDate - now])
      }
    },

    'INIT' ({ state, commit, dispatch }) {
      if (window.location.pathname.includes('debug')) {
        commit('ACTIVATE_DEBUG')
      }
      dispatch('DEFINE_COMPONENT')
      dispatch('DEFINE_BACKGROUND')
    },

    'RUN_INITIAL_ANIMATION' ({ commit, dispatch }, [d, duration]) {
      commit('SET_ANIMATION', { from: `rgb(${d}, ${d}, ${d})`, to: 'rgb(0, 0, 0)', duration })
      setTimeout(() => dispatch('INIT'), duration + 1)
    },

    'RUN_EPISODE_END_ANIMATION' ({ commit }) {
      commit('SET_ANIMATION', { from: '#000000', to: '#FFFFFF', duration: 2000 })
      return sleep(2000)
    }
  },

  getters: {
    component: state => state.component,
    debug: state => state.debug,
    animation: state => state.animation
  },

  modules: {
    episode,
    contrib
  }
})
