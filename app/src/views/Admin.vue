<template>
  <div id="admin" class="text-black">
    <h1>Nouvel enregistrement</h1>
    <div class="">
      <button
        v-if="recording === false && record === null"
        type="button" name="record"
        @click="recording = true"
      >
        Enregistrer
      </button>
      <audio-recorder
        v-if="recording" :key="key"
        class="m-b"
        @next="onRecordEnded"
      />
      <div v-if="message" class="m-b">
        {{ message }}
      </div>
      <button
        v-if="recording"
        type="button" name="reset"
        @click="reset"
      >
        Reset
      </button>
    </div>

    <h1>Enregistrements</h1>
    <div v-for="contrib in contribs" :key="contrib.filename">
      "{{ contrib.filename }}"
      <button v-if="contrib.player === false" @click="play(contrib)">
        Play
      </button>
      <audio
        v-else :src="contrib.src"
        controls autoplay
      />
    </div>
  </div>
</template>

<script>
import AudioRecorder from '@/components/AudioRecorder'

export default {
  name: 'Admin',

  components: {
    AudioRecorder
  },

  data () {
    return {
      record: null,
      recording: false,
      contribs: [],
      key: Math.random(),
      message: ''
    }
  },

  created () {
    const data = []
    this.$store.dispatch('GET_CONTRIBS').then(contribs => {
      for (const contrib of contribs) {
        data.push({ filename: contrib, src: '/static/assets/contributions/' + contrib, player: false })
      }
      this.contribs = data.reverse()
    })
  },

  methods: {
    play (contrib) {
      this.$set(contrib, 'player', true)
    },

    onRecordEnded (sended, err) {
      if (err instanceof DOMException) {
        this.message = 'déso, erreur du genre "pas detecté de micro" ; ou alors t\'as refusé d\'enregistrer et donc pas déso ; ou encore ton navigateur à sauvegardé le fait que t\'as refusé la dernière fois et réitère automatiquement, moyen déso. Dans le dernier cas il devrait être possible d\'autoriser de nouveau en cliquant sur une des icônes à gauche de la barre d\'adresse du navigateur voire tenter un petit CTRL+MAJ+R. Si c\'est aucune de ces raisons, préviens moi !'
      } else {
        if (sended === false) {
          this.message = 'méga déso, erreur d\'envoi, le serveur est pas content'
        } else if (sended === true) {
          this.message = 'envoi réussi, is this real life?'
        } else if (typeof err === 'string') {
          this.message = err
        }
        this.key = Math.random()
      }
    },

    reset () {
      this.key = Math.random()
      this.message = ''
    }
  }
}
</script>

<style lang="scss" scoped>
#admin {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 1rem;

  & > div {
    margin-top: 1.5rem;
  }

  ::v-deep {
    .audio-sender audio {
      margin: 1rem 0;
      position: static;
      width: 100%;
    }

    .skew {
      transform: none;
      .text span {
        color: black;
        background-color: inherit;
        padding: 0;
      }
    }
  }
}

.m-b {
  margin-bottom: 2rem;
}
</style>
