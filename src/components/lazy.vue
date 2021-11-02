<template>
  <div>
    <slot v-if="shouldRender" />
  </div>
</template>

<script lang="ts">
// https://medium.com/js-dojo/lazy-rendering-in-vue-to-improve-performance-dcccd445d5f
import { nextTick } from "vue";
export default {
  setup() {
    const shouldRender = ref(false);
    nextTick(() => {
      shouldRender.value = true;
    });

    return { shouldRender };
  },
};
</script>
