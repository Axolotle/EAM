<template>
  <div class="episode">
    <span v-if="debug">Episode: {{ episode }}</span>

    <!-- Display intro -->
    <text-display
      v-if="step === 'intro'"
      :content="content" @next="playEp"
    />

    <!-- playEp -->
    <button v-if="debug && step === 'audio'" @click="skipEpisode">
      Passer l'épisode
    </button>

    <!-- Display audio recorder -->
    <audio-recorder v-if="step === 'record'" @next="onRecordEnded" />

    <!-- Display record and ask to send it -->
    <audio-sender v-if="step === 'send'" :audio="record" @next="onEpisodeStepsEnded" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import data from '@/assets/content.json'
import TextDisplay from '@/components/TextDisplay'
import AudioRecorder from '@/components/AudioRecorder'
import AudioSender from '@/components/AudioSender'
import { sleep } from '@/utils'


export default {
  name: 'Episode',

  components: {
    TextDisplay,
    AudioRecorder,
    AudioSender
  },

  data () {
    return {
      step: 'intro',
      content: undefined,
      audio: null,
      record: null
    }
  },

  computed: {
    ...mapGetters(['episode', 'debug'])
  },

  created () {
    this.audio = this.$store.dispatch('PREFETCH_EPISODE', this.episode)
    this.content = data.episodes[this.episode]
  },

  methods: {
    async playEp () {
      this.step = 'audio'
      this.audio = await this.audio
      this.audio.muted = false
      this.audio.play()
      this.$store.dispatch('DEFINE_NEXT_EP')
      const loopPromise = this.$store.dispatch('PREFETCH_LOOP')
      this.audio.addEventListener(
        'ended',
        () => this.onEpisodeEnded(loopPromise),
        { once: true }
      )
    },

    async onEpisodeEnded (loopPromise) {
      const [loop] = await Promise.all([loopPromise, sleep(1500)])
      this.loop = loop
      this.step = 'record'
      loop.play()
    },

    onRecordEnded (record) {
      if (record) {
        this.record = record
        this.step = 'send'
      } else {
        this.onEpisodeStepsEnded()
      }
    },

    onEpisodeStepsEnded () {
      this.$store.dispatch('INIT')
    },

    // Debug
    skipEpisode () {
      this.audio.currentTime = this.audio.duration - 2
    }
  }
}
</script>

<style>
</style>
