<template>
  <circle
    :cy="pos"
    r="10" cx="35" fill="blue"
  />
</template>

<script>
import { easeInOutQuad } from '@/utils'


export default {
  name: 'StreetSound',

  props: {
    pos: { type: Number, required: true },
    audio: { type: Audio, required: true }
  },

  watch: {
    pos () {
      this.updateVolume()
    }
  },

  methods: {
    start () {
      this.audio.play()
      this.audio.addEventListener('ended', () => this.$emit('ended'))
    },

    updateVolume () {
      let volume = 0
      const distanceFromCenter = Math.abs(this.pos)
      if (distanceFromCenter <= 30) {
        if (this.audio.paused) {
          this.start()
        }
        volume = easeInOutQuad(1 - distanceFromCenter / 30)
      }
      this.audio.volume = volume
    }
  }
}
</script>

<style>
</style>
