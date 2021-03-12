<template>
  <div id="app">
    <div v-if="debug">
      <p>next: {{ nextEp }}</p>
      <p>nextDate: {{ nextEpDate }}</p>
    </div>

    <component :is="component" v-if="component" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Episode from '@/views/Episode'
import Street from '@/views/Street'


export default {
  name: 'App',

  components: {
    Episode,
    Street
  },

  computed: {
    ...mapGetters(['nextEpDate', 'nextEp', 'component', 'debug'])
  },

  created () {
    this.$store.dispatch('INIT')
  }
}
</script>

<style lang="scss">
@import '@/assets/app.scss';
</style>
