<template>
  <div class="container-center">
    <!-- Display intro -->
    <div class="m-auto text-padding">
      <text-display
        v-if="step === 'intro'"
        class="skew"
        :content="content" @next="playEp"
      />


      <!-- playEp -->
      <button v-show="debug && step === 'audio'" @click="skipEpisode">
        Passer l'épisode
      </button>

      <!-- Display audio recorder -->
      <audio-recorder v-if="step === 'record'" episode @next="onEpisodeStepsEnded" />

      <text-display v-if="step === 'message'" :content="message" class="skew" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import data from '@/assets/content.json'
import TextDisplay from '@/components/TextDisplay'
import AudioRecorder from '@/components/AudioRecorder'
import { sleep } from '@/utils'


export default {
  name: 'Episode',

  components: {
    TextDisplay,
    AudioRecorder
  },

  data () {
    return {
      step: 'intro',
      content: undefined,
      audio: null,
      record: null,
      message: ''
    }
  },

  computed: {
    ...mapGetters(['episode', 'debug', 'headphone'])
  },

  created () {
    this.audio = this.$store.dispatch('PREFETCH_EPISODE', this.episode)
    this.content = data.episodes[this.episode]
  },

  methods: {
    async playEp () {
      this.step = 'audio'
      this.audio = await this.audio
      this.audio.play()
      this.$store.dispatch('DEFINE_NEXT_EP', { temp: true })
      const loopPromise = this.$store.dispatch('PREFETCH_LOOP')
      this.audio.addEventListener(
        'ended',
        () => {
          if (this.episode === 4) {
            this.onEpisodeStepsEnded()
          } else {
            this.onEpisodeEnded(loopPromise)
          }
        },
        { once: true }
      )
    },

    async onEpisodeEnded (loopPromise) {
      const [loop] = await Promise.all([loopPromise, sleep(1500)])
      loop.volume = 0.8
      this.loop = loop
      this.step = 'record'
      if (this.headphone) {
        loop.play()
      }
    },

    async onEpisodeStepsEnded (sended) {
      this.message = [
        sended !== undefined ? data[sended ? 'success' : 'error'] : [],
        data.next_night
      ]
      this.step = 'message'
      this.$store.dispatch('ON_EPISODE_ENDED')
      if (this.headphone && this.loop) {
        while (this.loop.volume > 0.05) {
          this.loop.volume -= 0.05
          await sleep(100)
        }
        this.loop.pause()
      }
    },

    // Debug
    skipEpisode () {
      this.audio.currentTime = this.audio.duration - 1
    }
  }
}
</script>
