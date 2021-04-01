<template>
  <svg-drawing>
    <defs>
      <linearGradient
        id="top-grad"
        x1="0" x2="0"
        y1=".25" y2="0"
      >
        <stop offset="0%" stop-color="#000" />
        <stop offset="100%" stop-color="#070707" />
      </linearGradient>
    </defs>

    <g v-for="(b, i) in buildings" :key="i" :transform="b.transform">
      <path
        :class="{ 'building': i < buildings.length - 1 }"
        :d="b.path"
        :fill="i === buildings.length - 1 ? 'url(#top-grad)' : 'black'"
      />
      <path
        v-for="(w, j) in b.windows" :key="j + 'win'"
        class="windows"
        :d="toDString(w.points)"
        :transform="w.transform"
      />
    </g>
  </svg-drawing>
</template>

<script>
import { getRandInt, sleep, getShape, vRotate } from '@/utils'
import SvgDrawing from '@/components/SvgDrawing'


export default {
  name: 'CityBackground',

  components: {
    SvgDrawing
  },

  data () {
    return {
      lineH: 10,
      buildings: [],
      vX: vRotate([10, 0], -30),
      vY: vRotate([10, 0], 30),
      sizes: [
        { size: [50, 90, 40], pos: { x: 30, y: 10 } },
        { size: [30, 90, 40], pos: { x: -10, y: 10 } },
        { size: [90, 30, 40], pos: { x: -110, y: -50 } },
        { size: [110, 25, 40], pos: { x: -135, y: 10 } },
        { size: [30, 30, 120], pos: { x: 30, y: 100 } },
        { size: [30, 70, 40], pos: { x: -30, y: 140 } },
        // roof
        { size: [140, 100, 40], pos: { x: -180, y: 170 }, axes: [] }
      ]
    }
  },

  created () {
    this.generateBuildings()
    this.updatePoints()
  },

  methods: {
    toDString (points) {
      const h = this.lineH
      return 'M' + points.map(p => p.join(',')).join(`v${h}M`) + 'v' + h
    },

    generateBuildings () {
      const { vX, vY } = this
      this.buildings = this.sizes.map(({ size, pos, axes = [0, 1] }) => {
        const building = getShape(size, 10)
        building.transform = `translate(${vX[0] * pos.x + vY[0] * pos.y} ${vX[1] * pos.x + vY[1] * pos.y})`
        building.windows = axes.map(axe => {
          const points = []
          const [v1, v2] = axe === 0 ? vX : [-vY[0], -vY[1]]
          const [zTimes, aTimes] = [Math.round((size[2] - 2) / 3), Math.round((size[axe] - 2) / 3)]
          for (let z = 2; z < zTimes; z++) {
            for (let a = 2; a < aTimes; a++) {
              if (getRandInt(0, 3) > 2) {
                points.push([v1 * a * 3, v2 * a * 3 + z * 3 * 10])
              }
            }
          }
          return { points, transform: `translate(0 ${-size[2] * 10})` }
        })
        return building
      })
    },

    async updatePoints () {
      const { vX, vY, buildings } = this
      while (true) {
        for (var i = 0; i < buildings.length; i++) {
          const { size, windows } = buildings[i]
          const z = getRandInt(0, Math.round((size[2] - 2) / 3))

          for (var w = 0; w < windows.length; w++) {
            const [v1, v2] = w === 0 ? vX : [-vY[0], -vY[1]]
            const a = getRandInt(0, Math.round((size[w] - 2) / 3))
            const points = windows[w].points
            const index = getRandInt(0, points.length - 1)
            this.$set(points, index, [v1 * a * 3, v2 * a * 3 + z * 3 * 10])
            await sleep(getRandInt(10, 150) * 10)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
path.windows {
  vector-effect: non-scaling-stroke;
  stroke: white;
  stroke-width: 1px;
  stroke-linecap: butt;
}
</style>
