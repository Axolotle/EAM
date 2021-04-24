<template>
  <g>
    <line
      :x1="pos.x" :y1="(pos.y - 10)"
      :x2="pos.x" :y2="(pos.y + 10)"
    />

    <circle
      :cx="pos.x"
      :cy="pos.y"
      :r="r * 100"
    />
  </g>
</template>

<script>
import { easeInOutQuad, getRandInt } from '@/utils'


export default {
  name: 'StreetSound',

  props: {
    x: { type: Number, required: true },
    y: { type: Number, default: () => getRandInt(-90, 90) / 100 },
    v: { type: Object, required: true },
    audio: { type: Audio, required: true },
    r: { type: Number, default: 2 }
  },

  data () {
    return {
      read: false
    }
  },

  computed: {
    pos () {
      const { x, y, v } = this
      return { x: x * v.x[0] + y * v.y[0], y: x * v.x[1] + y * v.y[1] }
    }
  },

  watch: {
    x () {
      this.updateVolume()
    }
  },

  mounted () {
    this.updateVolume()
  },

  methods: {
    start () {
      this.audio.play()
      this.audio.addEventListener('ended', () => {
        this.read = true
      })
    },

    updateVolume () {
      const { x, r, pos } = this
      let volume = 0
      let distanceFromCenter = Math.abs(x)
      if (distanceFromCenter <= r) {
        distanceFromCenter = Math.abs(Math.hypot(pos.x, pos.y) / 100)
        if (this.audio.paused && this.read === false) {
          this.start()
        }
        volume = easeInOutQuad(1 - distanceFromCenter / r)
      }
      if (volume === 0) this.read = false
      this.audio.volume = volume
    }
  }
}
</script>

<style lang="scss" scoped>
line {
  stroke: white
}
circle {
  fill: none;
  stroke: $color-red;
}
</style>
