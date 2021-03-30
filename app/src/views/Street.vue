<template>
  <div class="street">
    <svg-drawing>
      <!-- BUILDINGS -->
      <g :transform="`translate(${t * vX[0]} ${t * vX[1]})`">
        <path
          v-for="(topBlock, i) in blocks[0]" :key="i"
          :transform="topBlock.transform"
          :d="topBlock.path"
          :fill="topBlock.color || 'black'"
          :opacity="topBlock.color ? '0.5' : '1'"
        />

        <g :transform="`translate(${vY[0] * 18} ${vY[1] * 18})`">
          <path
            v-for="(botBlock, i) in blocks[1]" :key="i + 'bot'"
            :transform="botBlock.transform"
            :d="botBlock.path"
            :fill="botBlock.color || 'black'"
            :opacity="botBlock.color ? '0.5' : '1'"
          />
        </g>
      </g>

      <!-- <street-sound
        v-for="(contrib, i) in contribs" :key="i"
        v-bind="contrib"
        @ended="switchAudio(contrib)"
      /> -->

      <line
        x1="0" y1="0"
        :x2="vX[0]" :y2="vX[1]"
        stroke="red"
      />
      <line
        x1="0" y1="0"
        :x2="vY[0]" :y2="vY[1]"
        stroke="green"
      />
      <line
        :x1="vY[0]" :y1="vY[1]"
        :x2="vY[0] * 2" :y2="vY[1] * 2"
        stroke="yellow"
      />
      <circle
        :cx="vZ[0]" :cy="vZ[1]"
        r="10" fill="red"
      />
    </svg-drawing>
  </div>
</template>

<script>
import { getRandInt, vRotate } from '@/utils'
import SvgDrawing from '@/components/SvgDrawing'
import StreetSound from '@/components/StreetSound'

export default {
  name: 'Street',

  components: {
    SvgDrawing
    // StreetSound
  },

  data () {
    const vX = vRotate([-100, 0], -30)
    const vY = vRotate([100, 0], 30)
    const w = 32
    return {
      loop: undefined,
      dispenser: undefined,
      contribs: [],
      r: 30,
      size: 100,
      // buildings
      blocks: [[], []],
      distance: [-w, -w],
      vX,
      vY,
      vZ: [vX[0] + vY[0], vX[1] + vY[1]],
      t: 0,
      w
    }
  },

  created () {
    this.generateBuildings()

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
  },

  mounted () {
    window.addEventListener('wheel', e => {
      this.animate((e.deltaY < 0 ? 1 : -1) * 2)
    }, { passive: true })
  },

  methods: {
    getShape (size, side = 0) {
      const [x, y, z] = size
      let v = [-100, 0]
      const points = [[0, 0]]
      for (let i = 0; i <= 4; i++) {
        v = vRotate(v, i === 0 ? 30 : 60)
        const mult = i % 3 === 0 ? y : (i % 3 === 2 ? x : z)
        points.push([v[0] * mult, v[1] * mult])
      }
      const shape = {
        path: 'M' + points.map(p => p.join(',')).join(' l'),
        distance: this.distance[side],
        size
      }
      this.distance[side] += x + getRandInt(50, 200) / 100
      return shape
    },

    generateBuildings () {
      const { w, vX, blocks } = this
      blocks.forEach((buildings, i) => {
        while (this.distance[i] < w) {
          buildings.push(this.getShape([getRandInt(5, 12), 10, 6], i))
        }
      })
      const distTotal = this.distance[1] = this.distance[0]
      const extra = { head: [[], []], tail: [[], []] }

      blocks.forEach((buildings, side) => {
        const len = buildings.length - 1
        for (var i = 0; i < 3; i++) {
          for (const [type, index, dir] of [['head', i, 1], ['tail', len - i, -1]]) {
            const distance = buildings[index].distance + (distTotal + w) * dir
            extra[type][side].push({ ...buildings[index], distance, color: dir ? 'red' : 'blue' })
          }
        }
      })

      blocks.forEach((buildings, i) => {
        buildings.unshift(...extra.tail[i])
        buildings.push(...extra.head[i])
        buildings.forEach(building => {
          building.transform = `translate(${building.distance * -vX[0]} ${building.distance * -vX[1]})`
        })
      })
      this.blocks = blocks.map(buildings => buildings.reverse())
    },

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
      this.t += 0.2 * dir

      if (this.t > this.distance[0]) {
        this.t = -this.w
      } else if (this.t < -this.w) {
        this.t = this.distance[0]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
