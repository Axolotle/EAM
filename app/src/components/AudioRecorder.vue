<template>
  <div>
    <button
      v-if="canRecord"
      type="button" name="record"
      aria-label="Démarrer l'enregistrement"
      @click="record"
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

    record () {
      this.recorder.start()
      setTimeout(() => {
        this.recorder.stream.getAudioTracks()[0].stop()
        this.recorder.stop()
      }, this.recordDuration)
    }
  }
}
</script>

<style scoped>
button {
  width: 60px;
  border: none;
  height: 60px;
  background-color: red;
  border-radius: 30px;
  color: white;
  font: inherit;
  cursor: pointer;
}
</style>
