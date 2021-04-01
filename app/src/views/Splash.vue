<template>
  <div id="splash-cont" :class="{ 'hide': hide }" class="fullscreen container">
    <div id="splash" class="text-black">
      <div>
        <div
          id="title" aria-hidden="true" aria-label="AEM"
          class="skew"
        >
          <span>╭─┐┌─╴╭╮╮</span>
          <span>├─┤├─╴│││</span>
          <span>╵ ╵╰─╴╵╵╵</span>
        </div>
        <p class="skew">
          une histoire à écouter
        </p>
      </div>

      <p class="skew">
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

      <p>
        <span class="skew">pièce sonore : Basile Touratier</span>
        <span class="skew">texte fiction : Léo Henry</span>
        <span class="skew">design & code : Nicolas Chesnais</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'


export default {
  name: 'Splash',

  data () {
    return {
      hide: false
    }
  },

  computed: {
    ...mapGetters(['finished', 'nextEp'])
  },

  methods: {
    run (data) {
      this.hide = true
      this.$store.dispatch('ON_SPLASH_SCREEN_CLOSED', data)
    }
  }
}
</script>

<style lang="scss" scoped>
#splash-cont {
  background-color: white;
}

#splash {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 50vh;
}

span {
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
  animation: opacity .3s linear;
  animation-fill-mode: both;
}

#street-btn {
  margin-top: 2rem;
}
</style>
