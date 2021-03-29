<template>
  <main id="app" ref="main">
    <div v-if="debug" class="debug">
      <p>next: {{ nextEp }}</p>
      <p>nextDate: {{ nextEpDate }}</p>
    </div>

    <city-background v-if="component !== 'street'" />

    <component :is="component" v-if="component" />
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import Episode from '@/views/Episode'
import Street from '@/views/Street'
import CityBackground from '@/views/CityBackground'


export default {
  name: 'App',

  components: {
    Episode,
    CityBackground,
    Street
  },

  computed: {
    ...mapGetters(['nextEpDate', 'nextEp', 'animation', 'component', 'debug'])
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
