<template>
  <div class="episode">
    Episode: {{ episode }}
    <text-display
      v-if="showIntro"
      :content="content" @next="playEp"
    />

    <audio-recorder v-if="showRecorder" @next="sendRecord" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import data from '@/assets/content.json'
import TextDisplay from '@/components/TextDisplay'
import AudioRecorder from '@/components/AudioRecorder'


export default {
  name: 'Episode',

  components: {
    TextDisplay,
    AudioRecorder
  },

  data () {
    return {
      showIntro: true,
      showRecorder: false,
      content: undefined,
      record: null,
      recordUrl: null
    }
  },

  computed: {
    ...mapGetters(['episode'])
  },

  created () {
    this.audio = this.$store.dispatch('PREFETCH_EPISODE', this.episode)
    this.content = data.episodes[this.episode]
  },

  methods: {
    async playEp () {
      this.showIntro = false
      const audio = await this.audio
      audio.muted = false
      audio.play()
      this.$store.dispatch('DEFINE_NEXT_EP')
      this.showRecorder = true
    },

    sendRecord (record) {
      if (record) {
        this.record = record
        this.recordUrl = URL.createObjectURL(record)
      }
    }
  }
}
</script>

<style>
</style>
