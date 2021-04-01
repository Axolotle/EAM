<template>
  <div>
    <div v-if="uploadMessage === null" class="skew">
      <text-display :content="[acknowledgment]" />

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

    <audio v-if="uploadMessage === null" :src="audioUrl" controls />

    <div v-else-if="uploadMessage !== null" class="skew">
      <text-display v-if="uploadMessage" :content="[uploadMessage]" />
    </div>
  </div>
</template>

<script>
import data from '@/assets/content.json'
import TextDisplay from '@/components/TextDisplay'


export default {
  name: 'AudioSender',

  components: {
    TextDisplay
  },

  props: {
    audio: { type: Blob, required: true }
  },

  data () {
    return {
      acknowledgment: data.acknowledgment,
      audioUrl: URL.createObjectURL(this.audio),
      tempFilename: new Date().toISOString().split('.')[0].replaceAll(':', '_') + '.ogg',
      uploadMessage: null
    }
  },

  methods: {
    send () {
      this.$store.dispatch('SEND_CONTRIB', this.audio).then(async response => {
        if (response.ok) {
          this.uploadMessage = data.success
        } else {
          this.uploadMessage = data.error
        }

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
