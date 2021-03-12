<template>
  <div class="text">
    <p v-for="(paragraph, i) in content" :key="i">
      <span v-for="(line, j) in paragraph" :key="j" class="alinea">
        <template v-if="Array.isArray(line)">
          <template v-for="part in line">
            <span v-if="typeof part === 'string'" :key="part">{{ part }}</span>
            <a
              v-else :key="part.a"
              href="#" @click="$emit('next')"
            >{{ part.a }}</a>
          </template>
        </template>
        <template v-else>{{ line }}</template>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'TextDisplay',

  props: {
    content: { type: Array, required: true }
  }
}
</script>

<style>
.alinea {
  display: block;
}
</style>
