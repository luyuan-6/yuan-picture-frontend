<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
// const loginUserStore = useLoginUserStore()
// loginUserStore.fetchLoginUser()
</script>

<template>
  <div id="app">
    <BasicLayout></BasicLayout>
  </div>
</template>

<style scoped>
#app {
}
</style>
