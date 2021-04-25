<template>
  <div>
    <button
      v-if="step === 'record'"
      type="button" name="record"
      aria-label="Démarrer l'enregistrement"
      :style="`animation-duration: 50ms, ${recordDuration}ms;`"
      :class="{ 'animate': recording }" class="record-btn"
      @click="onRecordClick"
    />

    <div v-if="step === 'send'" class="audio-sender" :class="{ 'skew': episode || testing }">
      <text-display v-if="episode" :content="[acknowledgment]" />

      <audio ref="audio" :src="url" controls />

      <div class="btns">
        <template v-if="episode || admin">
          <button
            type="button" name="send" :disabled="sendDisabled"
            @click="send"
          >
            envoyer
          </button>
          <button type="button" name="remove" @click="deleteRecord">
            supprimer
          </button>
          <a
            v-if="!testing"
            :href="url" :download="tempFilename" class="btn"
          >
            télécharger
          </a>
        </template>

        <button
          v-if="testing"
          type="button" name="remove" @click="deleteRecord"
        >
          ça marche
        </button>

        <button
          v-if="testing || admin"
          type="button" name="remove" @click="reset"
        >
          recommencer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import content from '@/assets/content.json'
import TextDisplay from '@/components/TextDisplay'

export default {
  name: 'AudioRecorder',

  components: {
    TextDisplay
  },

  props: {
    episode: { type: Boolean, default: false },
    testing: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
  },

  data () {
    return {
      step: null,
      // Recording
      recording: false,
      recordTimeoutId: null,
      recorder: null,
      blob: null,
      url: null,
      // Sending
      acknowledgment: content.acknowledgment,
      tempFilename: '',
      duration: null,
      uploadMessage: null
    }
  },

  computed: {
    ...mapGetters(['recordDuration']),

    sendDisabled () {
      return this.duration === null
    }
  },

  mounted () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.ask()
    } else {
      this.$emit('next', undefined, 'navigator')
    }
  },

  methods: {
    ask () {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.recorder = new MediaRecorder(stream)
        this.step = 'record'
        let chunks = []
        this.recorder.onstop = () => {
          this.blob = chunks[0]
          this.url = window.URL.createObjectURL(this.blob)
          chunks = []
          this.tempFilename = new Date().toISOString().split('.')[0].replaceAll(':', '_') + '.ogg'
          this.step = 'send'
          this.$nextTick(this.getDuration)
        }
        this.recorder.ondataavailable = e => {
          chunks.push(e.data)
        }
      }).catch(e => {
        this.$emit('next', undefined, 'no_micro')
      })
    },

    onRecordClick () {
      this.$emit('click')
      if (this.recording) {
        this.stopRecord()
        clearTimeout(this.recordTimeoutId)
      } else {
        this.startRecord()
      }
    },

    startRecord () {
      this.recorder.start()
      this.recording = true
      this.recordTimeoutId = setTimeout(() => this.stopRecord(), this.recordDuration)
    },

    stopRecord () {
      this.recorder.stop()
      this.recording = false
      this.recorder.stream.getAudioTracks()[0].stop()
    },

    // SENDING

    send () {
      const data = { blob: this.blob, duration: this.duration } = this
      this.$store.dispatch('SEND_CONTRIB', data).then(async response => {
        this.$emit('next', response.ok)
      })
    },

    deleteRecord () {
      this.$emit('next', undefined, 'son supprimé')
      this.uploadMessage = ''
    },

    reset () {
      this.ask()
    },

    download () {
      window.open(this.audio.url)
    },

    async getDuration () {
      const audio = new Audio(this.url)
      audio.addEventListener('durationchange', () => {
        if (audio.duration !== Infinity) {
          this.duration = audio.duration
          audio.remove()
        }
      }, false)
      audio.load()
      audio.volume = 0
      audio.currentTime = 100
      audio.play()
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes scale {
  to {
    transform: scale(0)
  }
}

@keyframes shape {
  to {
    border-radius: 0;
  }
}

.record-btn {
  width: 60px;
  border: none;
  height: 60px;
  background-color: $color-red;
  border-radius: 30px;
  color: white;
  font: inherit;
  cursor: pointer;

  &.animate {
    animation-name: shape, scale;
    animation-fill-mode: both;
  }
}

audio {
  display: block;
  width: 100%;
  margin: 1rem 0;
}

.btns {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  *:not(:last-child) {
    margin-right: .5rem;
  }

  button {
    margin-bottom: .5rem;
  }

  button:disabled {
    opacity: .5;
    cursor: auto;
  }
}
</style>
