<template>
  <div>
    <slot v-if="shouldRender" />
  </div>
</template>

<script lang="ts">
  import { nextTick } from 'vue';
  export default {
    setup() {
      const shouldRender = ref(false);
      nextTick(() => {
        shouldRender.value = true;
      });
      
      return { shouldRender }; 
    }
  }
</script>
