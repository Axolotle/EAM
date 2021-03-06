<template>
  <div class="street container-center">
    <div v-if="cantPlay" id="mention" class="m-auto text-padding">
      <text-display class="skew" :content="[['molette pour avancer/reculer']]" />
      <button class="skew" @click="cantPlay = false">
        commencer
      </button>
    </div>

    <svg-drawing>
      <!-- BUILDINGS -->
      <g :transform="buildingsTranslation">
        <g :transform="`translate(${v.y[0] * -1} ${v.y[1] * -1})`">
          <path
            v-for="(topBlock, i) in blocks[0]" :key="i + 'top'"
            class="building"
            :transform="topBlock.transform"
            :d="topBlock.path"
          />
        </g>
      </g>

      <circle
        :cx="0" :cy="0"
        r="10" fill="red"
      />

      <street-sound
        v-for="contrib in contribs" :key="contrib.index"
        v-bind="contrib"
        @ended="switchAudio(contrib)"
      />

      <g :transform="buildingsTranslation">
        <g :transform="`translate(${v.y[0] * 17} ${v.y[1] * 17})`">
          <path
            v-for="(botBlock, i) in blocks[1]" :key="i + 'bot'"
            class="building"
            :transform="botBlock.transform"
            :d="botBlock.path"
          />
        </g>
      </g>
    </svg-drawing>
  </div>
</template>

<script>
import { getRandInt, vRotate, getShape } from '@/utils'
import SvgDrawing from '@/components/SvgDrawing'
import StreetSound from '@/components/StreetSound'
import TextDisplay from '@/components/TextDisplay'

export default {
  name: 'Street',

  components: {
    SvgDrawing,
    StreetSound,
    TextDisplay
  },

  data () {
    const vX = vRotate([100, 0], -30)
    const vY = vRotate([100, 0], 30)
    const unit = 32
    return {
      cantPlay: undefined,
      loop: undefined,
      dispenser: undefined,
      contribs: [],
      // buildings
      blocks: [[], []],
      v: { x: vX, y: vY, z: [-vX[0] + vY[0], -vX[1] + vY[1]] },
      t: 0,
      unit,
      start: -unit,
      end: unit
    }
  },

  computed: {
    buildingsTranslation () {
      const { t, v: { x } } = this
      return `translate(${t * x[0]} ${t * x[1]})`
    }
  },

  created () {
    this.generateBuildings()

    this.$store.dispatch('PREFETCH_LOOP').then(audio => {
      audio.volume = 0.8
      this.loop = audio
      this.playLoop()
    })

    this.$store.dispatch('GET_AUDIO_DISPENSER').then(async audioDispenser => {
      this.dispenser = audioDispenser
      this.generateContribs()
    })
  },

  mounted () {
    window.addEventListener('wheel', e => {
      this.animate((e.deltaY < 0 ? -1 : 1))
    }, { passive: true })
  },

  methods: {
    generateBuildings () {
      const { start, unit, v, blocks } = this
      const distances = [start, start]
      blocks.forEach((buildings, i) => {
        while (distances[i] < unit) {
          const shape = getShape([getRandInt(5, 12), 10, 6])
          shape.distance = distances[i]
          distances[i] += shape.size[0] + getRandInt(50, 200) / 100
          buildings.push(shape)
        }
      })
      this.end = distances[0]
      const extra = { head: [[], []], tail: [[], []] }

      blocks.forEach((buildings, side) => {
        const len = buildings.length - 1
        for (var i = 0; i < 3; i++) {
          for (const [type, index, dir] of [['head', i, 1], ['tail', len - i, -1]]) {
            const distance = buildings[index].distance + (this.end + unit) * dir
            extra[type][side].push({ ...buildings[index], distance })
          }
        }
      })

      blocks.forEach((buildings, i) => {
        buildings.unshift(...extra.tail[i])
        buildings.push(...extra.head[i])
        buildings.forEach(building => {
          building.transform = `translate(${building.distance * v.x[0]} ${building.distance * v.x[1]})`
        })
      })
      this.blocks = blocks.map(buildings => buildings.reverse())
    },

    async generateContribs () {
      const { start, end, v } = this
      const contribs = []
      let x = start
      let index = 0
      while (x < end) {
        const audio = await this.dispenser.next()
        contribs.push({ x, v, audio, index: index++ })
        x += getRandInt(20, 150) / 10
      }
      this.contribs = contribs
    },

    playLoop () {
      this.loop.play().catch(() => {
        this.cantPlay = true
        setTimeout(() => this.playLoop(), 100)
      })
    },

    async switchAudio (contrib) {
      const audio = await this.dispenser.next()
      contrib.audio = audio
    },

    animate (dir) {
      const { start, end } = this

      // Update sound position
      this.contribs.forEach(contrib => (contrib.x += 0.2 * dir))
      const last = this.contribs[dir === -1 ? 0 : this.contribs.length - 1]
      const len = this.contribs.length - 1
      if (dir === -1 && last.x < start) {
        last.x = getRandInt((this.contribs[len].x + 2) * 10, (end + 5) * 10) / 10
        this.contribs.push(this.contribs.shift())
        this.switchAudio(this.contribs[this.contribs.length - 1])
      } else if (dir === 1 && last.x > end) {
        last.x = getRandInt((start - 5) * 10, (this.contribs[0].x - 2) * 10) / 10
        this.contribs.unshift(this.contribs.pop())
        this.switchAudio(this.contribs[0])
      }

      // Update buildings position
      let t = this.t + 0.2 * dir
      if (-t > end) {
        t = -start
      } else if (-t < start) {
        t = -end
      }
      this.t = t
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  line, circle {
    vector-effect: non-scaling-stroke;
  }
}

#mention {
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    margin-top: 2rem;
    margin-bottom: 3.5rem;
  }
}
</style>
