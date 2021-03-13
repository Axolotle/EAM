<template>
  <div class="street">
    La rue

    <svg
      viewBox="0 -100 70 200"
    >
      <street-sound
        v-for="(contrib, i) in contribs" :key="i"
        v-bind="contrib"
        @ended="switchAudio(contrib)"
      />
    </svg>
  </div>
</template>

<script>
import { getRandInt } from '@/utils'
import StreetSound from '@/components/StreetSound'

export default {
  name: 'Street',

  components: {
    StreetSound
  },

  data () {
    return {
      loop: undefined,
      dispenser: undefined,
      contribs: [],
      r: 30,
      size: 100,
      viewbox: undefined
    }
  },

  created () {
    this.$store.dispatch('PREFETCH_LOOP').then(audio => {
      this.loop = audio
      this.playLoop()
    })
    this.$store.dispatch('GET_AUDIO_DISPENSER').then(async audioDispenser => {
      this.dispenser = audioDispenser
      for await (const audio of audioDispenser.next(3)) {
        this.contribs.push({ pos: this.getPos(), audio })
      }
    })
    window.addEventListener('wheel', e => {
      this.animate(e.deltaY < 0 ? 1 : -1)
    })
  },

  methods: {
    playLoop () {
      this.loop.play().catch(() => {
        setTimeout(() => this.playLoop(), 100)
      })
    },

    async switchAudio (contrib) {
      contrib.audio = await this.dispenser.next()
    },

    getPos () {
      const { size, r } = this
      const pos = getRandInt(-size, size)
      if (pos >= -r && pos <= r) {
        return this.getPos()
      } else if (this.pointIsTooClose(pos)) {
        return this.getPos()
      }
      return pos
    },

    pointIsTooClose (p) {
      return !this.contribs.every(({ pos }) => {
        return Math.abs(pos - p) > this.r * 1.5
      })
    },

    animate (dir) {
      this.contribs.forEach(contrib => {
        let pos = contrib.pos + dir
        if (pos < -this.size || pos > this.size) {
          pos = this.getPos()
        }
        contrib.pos = pos
      })
    }
  }
}
</script>

<style>
svg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: auto;
}
</style>
