<template>
  <div id="app">
    <p>next: {{ nextEp }}</p>
    <p>nextDate: {{ nextEpDate }}</p>

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
    ...mapGetters(['nextEpDate', 'nextEp', 'component'])
  },

  created () {
    this.$store.dispatch('INIT')
  }
}
</script>

<style lang="scss">
@import '@/assets/app.scss';
</style>
