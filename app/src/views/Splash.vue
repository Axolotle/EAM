<template>
  <div id="splash" :class="{ 'hide': hide }" class="container-center">
    <div class="m-auto text-padding text-black">
      <div class="skew line-padding">
        <div id="title" aria-hidden="true" aria-label="AEM">
          <span>╭─┐┌─╴╭╮╮</span>
          <span>├─┤├─╴│││</span>
          <span>╵ ╵╰─╴╵╵╵</span>
        </div>
        <p>une histoire à écouter</p>
      </div>

      <p class="actions line-padding skew">
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

      <p class="skew line-padding">
        la voix : Maë<br>
        pièce sonore : Basile Touratier<br>
        texte fiction : Léo Henry<br>
        design & code : Nicolas Chesnais
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
#splash {
  position: absolute;
  top: 0;
  left: 0;
  background-color: $white;
}

.actions {
  margin: 10vh 0;
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

#street-btn {
  margin-top: 2rem;
}
</style>
