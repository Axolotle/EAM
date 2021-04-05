<template>
  <div class="audio-sender">
    <div v-if="!uploadIsOk" :class="{ 'skew': styling }">
      <text-display v-if="styling" :content="[acknowledgment]" />

      <div class="btns">
        <button type="button" name="send" @click="send">
          Envoyer
        </button>
        <button type="button" name="remove" @click="deleteRecord">
          Supprimer
        </button>
        <a :href="audioUrl" :download="tempFilename" class="btn">
          Télécharger
        </a>
      </div>
    </div>

    <audio
      v-if="!uploadIsOk" ref="audio"
      :src="audioUrl" controls
    />

    <div v-if="uploadMessage !== null" class="skew">
      <text-display v-if="uploadMessage" :content="[uploadMessage]" />
    </div>
  </div>
</template>

<script>
import content from '@/assets/content.json'
import TextDisplay from '@/components/TextDisplay'


export default {
  name: 'AudioSender',

  components: {
    TextDisplay
  },

  props: {
    audio: { type: Blob, required: true },
    styling: { type: Boolean, default: true }
  },

  data () {
    return {
      acknowledgment: content.acknowledgment,
      audioUrl: URL.createObjectURL(this.audio),
      tempFilename: new Date().toISOString().split('.')[0].replaceAll(':', '_') + '.ogg',
      uploadMessage: null,
      uploadIsOk: false
    }
  },

  methods: {
    send () {
      const data = {
        blob: this.audio,
        duration: this.$refs.audio.duration
      }
      this.$store.dispatch('SEND_CONTRIB', data).then(async response => {
        if (response.ok) {
          this.uploadMessage = content.success
        } else {
          this.uploadMessage = content.error
        }
        this.uploadIsOk = this.styling ? true : response.ok

        this.$emit('next')
      })
    },

    deleteRecord () {
      this.$emit('next')
      this.uploadMessage = ''
    },

    download () {
      window.open(this.audioUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
audio {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.btns {
  *:not(:last-child) {
    margin-right: 1rem;
  }
}
</style>
