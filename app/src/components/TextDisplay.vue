<template>
  <div class="text" v-bind="$attrs">
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

<style lang="scss" scoped>
p {
  margin-top: 0;
  span {
    background: #030303;
    padding: 0 30px;
  }
}

.alinea {
  display: block;
}
.skew {
  transform: skewY(-5deg) scale(0.9, 1);
}
</style>
