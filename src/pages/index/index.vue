<script setup lang="ts">
import useUserStore from '@/store/module/user.ts'

const userStore = useUserStore()

onLoad(() => {
  // tokenCache.set('Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsYXltYW4iLCJsb2dpbl91c2VyX2tleSI6IjQ4MWFkMGQ0LWMxOTgtNGUwMS1hZjdjLWQzZTFjNGVjMjRjMCJ9.K_K0UD9Hs94Z6ecVbDjXueGP1CHGP5OpisqbueLEjL_Uyh4ifxX9izJ8VBazSuQ46Io5iAV6ekdLJEGCiiIPSg')
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
