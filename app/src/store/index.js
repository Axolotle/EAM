import Vue from 'vue'
import Vuex from 'vuex'
import episode from './episode.js'
import contrib from './contrib.js'
import { sleep } from '@/utils'


Vue.use(Vuex)

export default new Vuex.Store({
  state: () => ({
    splash: localStorage.getItem('headphone') === null,
    component: undefined,
    headphone: localStorage.getItem('headphone') === 'true',
    debug: false,
    animation: null
  }),

  mutations: {
    'SET_DEBUG' (state, boolean) {
      state.debug = boolean
    },

    'SET_SPLASH' (state, boolean) {
      state.splash = boolean
    },

    'SET_HEADPHONE' (state, boolean) {
      state.headphone = boolean
      localStorage.setItem('headphone', boolean)
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
    'ACTIVATE_DEBUG' ({ state, commit }) {
      commit('SET_DEBUG', true)
      commit('SET_DEBUG_VALUES', {
        delayMultiplier: 0.1,
        recordDuration: 60000
      })
    },

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
        const delta = 1 - curr / max
        dispatch('RUN_INITIAL_ANIMATION', [delta, nextEpDate - now])
      }
    },

    'INIT' ({ state, commit, dispatch }) {
      if (window.location.pathname.includes('debug')) {
        dispatch('ACTIVATE_DEBUG')
      }
      dispatch('DEFINE_COMPONENT')
      dispatch('DEFINE_BACKGROUND')
    },

    'RUN_INITIAL_ANIMATION' ({ commit, dispatch }, [d, duration]) {
      commit('SET_ANIMATION', { from: `rgba(255, 255, 255, ${d})`, to: 'rgba(255, 255, 255, 0)', duration })
      setTimeout(() => dispatch('INIT'), duration + 1)
    },

    'RUN_EPISODE_END_ANIMATION' ({ commit }) {
      commit('SET_ANIMATION', { from: 'rgba(255, 255, 255, 0)', to: 'rgba(255, 255, 255, 1)', duration: 2000 })
      return sleep(2000)
    },

    'ON_SPLASH_SCREEN_CLOSED' ({ commit, dispatch }, headphone) {
      commit('SET_HEADPHONE', headphone)
      commit('SET_SPLASH', false)
    },

    'ON_EPISODE_ENDED' ({ commit, dispatch }) {
      commit('SET_ANIMATION', { from: 'rgba(255, 255, 255, 0)', to: 'rgba(255, 255, 255, 1)', duration: 2000 })
      setTimeout(() => {
        dispatch('DEFINE_NEXT_EP')
        dispatch('INIT')
      }, 2000)
    }
  },

  getters: {
    component: state => state.component,
    debug: state => state.debug,
    animation: state => state.animation,
    splash: state => state.splash
  },

  modules: {
    episode,
    contrib
  }
})
