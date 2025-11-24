<script setup lang="ts">
</script>

<template>
  <view class="layout h-full w-full bg-[#F2F1F6]">
    <sar-toast-agent />
    <sar-dialog-agent />
    <slot />
  </view>
</template>

<style lang="scss">
.layout{
  background: linear-gradient(177deg,rgba(213, 228, 247, 1) 0%, rgba(245, 245, 245, 1) 100%);

  //background: linear-gradient(180deg,rgba(213, 228, 247, 1) 0%, rgba(255, 255, 255, 1) 100%);
}
</style>
