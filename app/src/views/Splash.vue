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
        ça commence ici :
        <button type="button" name="remove" @click="run(true)">
          j'ai un casque
        </button>
        <button type="button" name="remove" @click="run(false)">
          je n'ai pas de casque
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
export default {
  name: 'SPLASH',

  data () {
    return {
      hide: false
    }
  },

  methods: {
    run (headphone) {
      this.hide = true
      setTimeout(() => {
        this.$store.dispatch('ON_SPLASH_SCREEN_CLOSED', headphone)
      }, 300)
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
</style>
