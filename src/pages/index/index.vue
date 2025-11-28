<script setup lang="ts">
import { tokenCache } from '@/store/cache.ts'
import useUserStore from '@/store/module/user.ts'

const userStore = useUserStore()

onLoad(() => {
  tokenCache.set('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJnX2R5IiwibG9naW5fdXNlcl9rZXkiOiJjOGNmZGFhMS04OWE2LTRiZmMtODk3OS04YTJiOWE0M2U1OTQifQ.TGmosSZPS1kWtqJtXl06mwsHrLKfMFJnalzequQdkE2pZTMY_TiqyAPFXnyIjPDe2h5GGcyj8WhpAZAHd271Pw')
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
