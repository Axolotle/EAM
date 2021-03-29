<template>
  <svg ref="svg" :view-box.camel="viewBox">
    <defs>
      <linearGradient
        id="top-grad"
        x1="0.25" x2="0"
        y1="0.25" y2="0"
      >
        <stop offset="0%" stop-color="#000" />
        <stop offset="100%" stop-color="#030303" />
      </linearGradient>
    </defs>

    <g transform="translate(0.5, 0)">
      <g
        v-for="({ points, transform, cache }, i) in squares" :key="i"
        :transform="transform"
      >
        <g>
          <path :d="cache" :transform="`translate(${xMult / 2} ${yMult / 2})`" />
          <path class="windows" :d="toDString(points)" />
        </g>
      </g>
    </g>

    <rect
      id="top"
      fill="url(#top-grad)"
      width="1200" height="1200"
      transform="translate(200 100) skewY(30) skewX(-41)"
    />
  </svg>
</template>

<script>
import { getRandInt, sleep } from '@/utils'

export default {
  name: 'CityBackground',

  data () {
    const x = 35
    const y = 20
    return {
      screenSize: {
        w: 0,
        h: 0
      },
      squares: [],
      xMult: 35,
      yMult: 20,
      lineH: 8,
      sizes: [
        /* eslint-disable */
        // [xCount, yCount, skewYDir, translateX, translateY, topScale]
        [25, 19, -1, -30 * x     ,  15 * y    ,  0.5, 'red', 'm -176.66918,-204 875,0 176.66919,204 v 408 l -875,0 -176.66921,-204 z'],
        [15, 12,  1,  10 * x - 15,  -3 * y    , 0.75, 'yellow', 'm 0,0 109.47204,-126.11813 525,0 -109.47214,126.11812 v 248 h -525 z'],
        [3,  30,  1,  15 * x     , -21 * y    ,  0.2, 'blue'],
        [6,  30, -1,  18 * x     , -17 * y    ,  0.2, 'blue', 'm -105,487.58548 v -608.82904 l 210,0.55493 105,121.243695 v 607.444935 l -210,0 z'],
        [25, 20, -1, -40 * x     ,  -5 * y    ,    0, 'green', 'm -176.66922,204 0,-408 h 875 l 176.66922,204 v 408 l -875,0 z'],
        [7,  19, -1,   0 * x     , -15 * y + 5,  0.5, 'orange'],
        [20, 19,  1, -20 * x     , -36 * y    ,  0.5, 'cyan', 'm 0,0 245,-282.25408 700,0 v 408 l -245,282.25408 h -700 z'],
        [12,  19, -1, 10 * x,      -25 * y    ,  0.2, 'pink'],
        [20, 19,  1, -10 * x     , -46 * y -3 ,  0.5, 'purple', 'm 0,0 419.9999,-483.86411 h 700.0001 v 405.537436 l -420,486.326674 h -700 z'],
        /* eslint-enable */
      ]
    }
  },

  computed: {
    viewBox () {
      let { w, h } = this.screenSize
      if (w > 1680) {
        h = h * (1680 / w)
        w = 1680
      }
      if (h > 1050) {
        w = w * (1050 / h)
        h = 1050
      }
      if (h < 800) {
        h = 1050
        w = 1680
      }
      return `-${Math.round(w / 2)} -${Math.round(h / 2)} ${w} ${h}`
    }
  },

  created () {
    this.sizes = this.sizes.reverse()
    this.computeSquares()
    this.updatePoints()
  },

  mounted () {
    this.updateScreenSize()
    window.addEventListener('resize', this.updateScreenSize)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.updateScreenSize)
  },

  methods: {
    updateScreenSize () {
      const { width, height } = this.$refs.svg.getBoundingClientRect()
      this.screenSize = { w: width, h: height }
    },

    toDString (points) {
      const h = this.lineH
      return 'M' + points.map(p => p.join(',')).join(`v${h}M`) + 'v' + h
    },

    computeSquares () {
      const { yMult, xMult } = this
      for (const [xCount, yCount, sy, tx, ty, ts, color, cache] of this.sizes) {
        const points = []
        for (let y = yMult; y <= yCount * yMult; y += yMult) {
          for (let x = xMult; x <= xCount * xMult; x += xMult) {
            if (getRandInt(0, 3) > 2) {
              points.push([x, y])
            }
          }
        }
        this.squares.push({
          points,
          transform: `translate(${tx} ${ty})skewY(${sy * 30})`,
          cache
        })
      }
    },

    async updatePoints () {
      const { yMult, xMult } = this
      while (true) {
        for (var i = 0; i < this.sizes.length; i++) {
          const [xCount, yCount] = this.sizes[i]
          const index = getRandInt(0, this.squares[i].points.length - 1)
          this.$set(this.squares[i].points, index, [
            getRandInt(0, xCount) * xMult,
            getRandInt(0, yCount) * yMult
          ])
          await sleep(getRandInt(10, 150) * 10)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  background-color: #030303;

  path.windows {
    vector-effect: non-scaling-stroke;
    stroke: white;
    stroke-width: 1px;
    stroke-linecap: butt;
  }

  .stroke-red {
    stroke: $color-red;
  }
}
</style>