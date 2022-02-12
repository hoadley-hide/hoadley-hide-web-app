<template>
  <div>
    <client-only>
      <div v-if="shouldRender">
        <slot v-bind:activeUser="activeUser" />
      </div>
      <div v-else>
        <slot name="blocked" />
      </div>
    </client-only>
  </div>
</template>

<script lang="ts">
import { AppUserEntity, PermissionScope } from "~/types";
import { authorised } from "~/common/authorisation";

export default {
  props: {
    allow: { type: Array, default: () => [] as PermissionScope[] },
    block: { type: Array, default: () => [] as PermissionScope[] },
  },
  computed: {
    shouldRender() {
      return authorised(
        this.$store,
        this.allow as PermissionScope[],
        this.block as PermissionScope[]
      );
    },

    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
    },
  },
};
</script>
