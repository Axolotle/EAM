<template>
  <div id="splash" :class="{ 'hide': hide }" class="container-center">
    <div class="m-auto text-padding text-black">
      <div class="skew line-padding m-b-vh">
        <div id="title" aria-hidden="true" aria-label="AEM">
          <span>╭─┐┌─╴╭╮╮</span>
          <span>├─┤├─╴│││</span>
          <span>╵ ╵╰─╴╵╵╵</span>
        </div>
        <p>une histoire à écouter</p>
      </div>

      <div v-if="!finished" class="line-padding">
        <p class="skew" v-html="message" />

        <p v-if="test === null" class="skew">
          <button type="button" @click="test = true">
            tester un enregistrement
          </button>
        </p>

        <audio-recorder
          v-if="test" testing
          class=""
          @next="onRecordEnded"
        />
      </div>

      <p class="line-padding m-t-vh skew">
        <template v-if="finished && nextEp === null">
          <button type="button" name="reset" @click="$store.dispatch('RESET_EPISODE')">
            recommencer
          </button>
        </template>

        <template v-else>
          ça commence ici :

          <button type="button" name="headphone" @click="run(['SET_HEADPHONE', true ])">
            j'ai un casque
          </button>

          <button type="button" name="noheadphone" @click="run(['SET_HEADPHONE', false ])">
            je n'ai pas de casque
          </button>
        </template>

        <button
          v-if="finished"
          id="street-btn"
          type="button" name="gotostreet" @click="$store.dispatch('RESTORE_FINISHED')"
        >
          retourner dans la rue
        </button>
      </p>

      <p class="skew line-padding m-t-vh">
        voix : Maë<br>
        pièce sonore : Basile Touratier<br>
        texte fiction : Léo Henry<br>
        design & code : Nicolas Chesnais
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AudioRecorder from '@/components/AudioRecorder'


export default {
  name: 'Splash',

  components: {
    AudioRecorder
  },

  data () {
    return {
      hide: false,
      test: null,
      reload: false,
      message: 'il vous sera proposé d\'enregistrer des messages,<br>vérifiez que votre micro est branché,<br>puis faites éventuellement un test :'
    }
  },

  computed: {
    ...mapGetters(['finished', 'nextEp'])
  },

  methods: {
    run (data) {
      this.hide = true
      this.$store.dispatch('ON_SPLASH_SCREEN_CLOSED', data)
    },

    onRecordEnded (sended, err) {
      if (err === 'no_micro') {
        if (this.message === 'pas de micro trouvé/autorisé') {
          this.message = 'Tentez de recharger la page (F5) et réessayez'
          this.test = false
        } else {
          this.message = 'pas de micro trouvé/autorisé'
          this.test = null
        }
      } else if (err === 'navigator') {
        this.message = 'le navigateur ne peut pas enregistrer d\'audio'
        this.test = false
      } else {
        this.test = false
        this.message = ''
      }
    },

    onReload () {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
#splash {
  position: absolute;
  top: 0;
  left: 0;
  background-color: $white;
}

.m-b-vh {
  margin-bottom: 5vh;
}
.m-t-vh {
  margin-top: 5vh;
}

#title span {
  display: block;
}

button {
  display: block;
  margin-top: 1rem;
}

@keyframes opacity {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.hide {
  animation: opacity .5s linear;
  animation-fill-mode: both;
}

::v-deep .record-btn {
  margin-left: 2rem;
  margin-top: 1rem;
}
</style>
