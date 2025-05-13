<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import { healthUsingGet } from '@/api/mainController'

healthUsingGet().then((res) => {
  console.log(res.data)
})
</script>
<style></style>
