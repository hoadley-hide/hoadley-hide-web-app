<template>
  <div class="qr-code-container">
    <lazy>
      <client-only>
        <vue-qr
          :correctLevel="3"
          :text="url"
          :size="500"
          :margin="20"
          :logoSrc="`/hh-qr-code-logo-192x192.png`"
          :logoScale="0.3"
          :logoCornerRadius="0"
          class="qr-code-image"
        ></vue-qr>
      </client-only>
    </lazy>
  </div>
</template>

<script lang="ts">
export default {
  props: ["url"],
};
</script>

<style lang="css" scoped>
.qr-code-container {
}
.qr-code-image {
  width: 50vh;
  height: 50vh;
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
}
</style>