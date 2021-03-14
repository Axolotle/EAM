<template>
  <div>
    <button
      v-if="canRecord"
      type="button" name="record"
      aria-label="Démarrer l'enregistrement"
      :style="`animation-duration: 50ms, ${recordDuration}ms;`"
      :class="{ 'animate': recording }"
      @click="onRecordClick"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'


export default {
  name: 'AudioRecorder',

  data () {
    return {
      canRecord: false,
      recording: false,
      recorder: null
    }
  },

  computed: mapGetters(['recordDuration']),

  created () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.ask()
    } else {
      this.$emit('next')
    }
  },

  methods: {
    ask () {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.init(stream)
      }).catch(() => {
        this.$emit('next')
      })
    },

    init (stream) {
      this.recorder = new MediaRecorder(stream)
      this.canRecord = true
      this.recorder.ondataavailable = ({ data }) => {
        this.$emit('next', data)
      }
    },

    onRecordClick () {
      if (this.recording) {
        this.stopRecord()
      } else {
        this.record()
      }
    },

    record () {
      this.recorder.start()
      this.recording = true
      setTimeout(() => this.stopRecord(), this.recordDuration)
    },

    stopRecord () {
      this.recorder.stream.getAudioTracks()[0].stop()
      this.recorder.stop()
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

button {
  width: 60px;
  border: none;
  height: 60px;
  background-color: red;
  border-radius: 30px;
  color: white;
  font: inherit;
  cursor: pointer;

  &.animate {
    animation-name: shape, scale;
    animation-fill-mode: both;
  }
}
</style>
