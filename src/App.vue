<script setup lang="ts">
import useUserStore from '@/store/module/user.ts'

const userStore = useUserStore()

onLaunch(async () => {
  // userStore.prepare()
})
</script>

<template>
  <view />
</template>

<style lang="scss">
@use 'sard-uniapp/index.scss';
</style>
