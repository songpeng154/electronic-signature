<script setup lang="ts">
defineProps<{
  title: string
  hideBack?: boolean
}>()

function back() {
  uni.navigateBack()
}
</script>

<template>
  <div class="header pos-relative h-60px flex items-center justify-between text-18px text-black" px-10px>
    <div class="flex flex-1 items-center gap-10px">
      <sar-icon
        v-if="!hideBack"
        size="50"
        name="left"
        @click="back()"
      />
      <span>{{ title }}</span>
    </div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.header{
  z-index: 10;
  height: 54px;
}
</style>
