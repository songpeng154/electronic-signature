<script setup lang="ts">
import useUserStore from '@/store/module/user.ts'

const userStore = useUserStore()

onLoad(() => {
  // tokenCache.set('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhdXJvcmEuIiwibG9naW5fdXNlcl9rZXkiOiIwODU0OGVlMy0yZjkyLTRmZmMtYTBiZC05YjRjODcyNjQ2YTkifQ.fpaK0gNf_OADRbF-MBIEnC7qtupHQCGMl1rFzNGf0_d4RX-CXD5eYZrnWfNUvnDIg4DepMznXIhpgVCu2CekFw')
  userStore.prepare()
})
</script>

<template>
  <div class="p-20px text-center text-black">
    登录中...
  </div>
</template>

<style scoped lang="scss">

</style>
