<template>
  <main id="app" ref="main" class="container">
    <div v-if="debug" class="debug">
      <p>next: {{ nextEp }}</p>
      <p>nextDate: {{ nextEpDate }}</p>
    </div>

    <city-background v-if="component !== 'street'" />

    <component :is="component" v-if="component" />

    <splash v-if="splash" />

    <button
      v-if="finished"
      id="credits"
      @click="$store.dispatch('SHOW_SPLASH')"
    >
      crédits
    </button>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import Splash from '@/views/Splash'
import Episode from '@/views/Episode'
import Street from '@/views/Street'
import CityBackground from '@/views/CityBackground'


export default {
  name: 'App',

  components: {
    Splash,
    Episode,
    CityBackground,
    Street
  },

  computed: {
    ...mapGetters(['nextEpDate', 'nextEp', 'animation', 'component', 'debug', 'splash', 'finished'])
  },

  watch: {
    animation (val) {
      this.$refs.main.animate(...val)
    }
  },

  created () {
    this.$store.dispatch('INIT')
  }
}
</script>

<style lang="scss">
@import '@/assets/app.scss';
</style>
