<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh; min-width: 100vh">
      <a-layout-header class="header"><GlobalHeader /></a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer
        ><a-layout-footer class="footer">
          <a href="https://blog.csdn.net/qq_20770569" target="_blank"> 路远 </a>
        </a-layout-footer>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>

#basicLayout .header {
  padding-inline: 20px;
  margin-bottom: 16px;
  color: unset;
  background: white;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
  padding: 20px;
}
</style>
