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
      <audio-recorder v-if="recording && record === null" @next="onRecordEnded" />
      <audio-sender v-if="record" :audio="record" :styling="false" />
      <button
        v-if="record"
        type="button" name="reset"
        @click="record = null"
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
import AudioSender from '@/components/AudioSender'


export default {
  name: 'Admin',

  components: {
    AudioRecorder,
    AudioSender
  },

  data () {
    return {
      record: null,
      recording: false,
      contribs: []
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

    onRecordEnded (record) {
      this.record = record
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
      width: auto;
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
</style>
