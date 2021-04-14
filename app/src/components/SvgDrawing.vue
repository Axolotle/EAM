<template>
  <svg
    ref="svg" v-bind="$attrs"
    :view-box.camel="viewBox" class="fullscreen"
  >
    <slot name="default" />
  </svg>
</template>

<script>
export default {
  name: 'SvgDrawing',

  data () {
    return {
      w: 0,
      h: 0,
      maxW: 1680,
      maxH: 1050
    }
  },

  computed: {
    viewBox () {
      let { w, h, maxW, maxH } = this

      if (w > maxW) {
        h = h * (maxW / w)
        w = maxW
      }
      if (h > maxH) {
        w = w * (maxH / h)
        h = maxH
      }
      if (h < 800) {
        if (h < w) {
          w = maxW * 1.5
        } else {
          h = maxH * 2
        }
      }
      return `-${Math.round(w / 2)} -${Math.round(h / 2)} ${w} ${h}`
    }
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
      Object.assign(this, { w: width, h: height })
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  z-index: -1;
  background-color: $color-grey;
}
</style>
