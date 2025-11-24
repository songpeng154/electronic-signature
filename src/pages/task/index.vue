<script setup lang="ts">
import type { LoadMoreStatus, PullDownRefreshExpose } from 'sard-uniapp'
import { getSupervisingList } from '@/service/api/supervising.ts'
import { tokenCache } from '@/store/cache.ts'
import useUserStore from '@/store/module/user.ts'

const query = ref({
  taskName: undefined,
  pageNum: 1,
  pageSize: 10,
})
const refreshing = ref(false)
const total = ref(0)
const pullDownRefresh = ref<PullDownRefreshExpose>()
// 加载更多
const loadMoreStatus = ref<LoadMoreStatus>('incomplete')
const supervisoryList = ref<any[]>([])

const userStore = useUserStore()

async function getList() {
  const res = await getSupervisingList(query.value)

  total.value = res.total
  return res.rows
}

const toInitiateSupervision = () => {
  uni.navigateTo({ url: '/pages-sub/initiate-supervision/index' })
}
const toDetails = (id) => {
  uni.navigateTo({ url: `/pages-sub/supervision-details/index?id=${id}` })
}

function onScroll(event: any) {
  pullDownRefresh.value?.enableToRefresh(event.detail.scrollTop === 0)
}

function onScrolltoupper() {
  pullDownRefresh.value?.enableToRefresh(true)
}

async function onRefresh() {
  query.value.pageNum = 1
  refreshing.value = true
  const todo = await getList().finally(() => refreshing.value = false)
  supervisoryList.value = todo
  loadMoreStatus.value = supervisoryList.value.length < total.value ? 'incomplete' : 'complete'
}

async function loadMoreFetch(page: number) {
  query.value.pageNum = page
  loadMoreStatus.value = 'loading'
  const todo = await getList().catch((error) => {
    loadMoreStatus.value = 'error'
    return Promise.reject(error)
  })
  supervisoryList.value = [...supervisoryList.value, ...todo]
  loadMoreStatus.value = supervisoryList.value.length < total.value ? 'incomplete' : 'complete'
}

function onLoadMore() {
  if (!refreshing.value)
    loadMoreFetch(++query.value.pageNum)
}

function onReload() {
  if (!refreshing.value)
    loadMoreFetch(query.value.pageNum)
}

function onScrolltolower() {
  if (!refreshing.value && loadMoreStatus.value === 'incomplete')
    loadMoreFetch(++query.value.pageNum)
}

function onSearch() {
  onRefresh()
}

onLoad(async () => {
  // await userStore.prepare()
  await onRefresh()
})
</script>

<template>
  <div class="home h-full w-full flex flex-col justify-between">
    <Header hide-back title="BM督办" />
    {{ tokenCache.get() }}
    <div class="flex flex-1 flex-col gap-10px overflow-hidden p-10px">
      <sar-input
        v-model="query.taskName"
        root-class="bg-white !rounded-2xl"
        placeholder="请输入..."
        @blur="onSearch()"
      >
        <template #prepend>
          <sar-icon name="search" />
        </template>
      </sar-input>
      <div class="flex-1 overflow-hidden">
        <scroll-view
          scroll-y
          class="h-full"
          :throttle="false"
          @scroll="onScroll"
          @scrolltoupper="onScrolltoupper"
          @scrolltolower="onScrolltolower"
        >
          <sar-pull-down-refresh
            ref="pullDownRefresh"
            root-class="h-full"
            :loading="refreshing"
            :disabled="loadMoreStatus === 'loading'"
            @refresh="onRefresh"
          >
            <sar-card
              v-for="item in supervisoryList"
              :key="item.id"
              root-class="mb-10px w-full"
              @click="toDetails(item.id)"
            >
              <div class="w-full flex items-center justify-between gap-10px">
                <img
                  class="h-60px w-60px rounded-full bg-[#F1F9FF] p-15px"
                  style="box-sizing: border-box"
                  src="@/static/notice-item.png"
                  alt=""
                >
                <div class="flex flex-1 items-center justify-between gap-10px overflow-hidden">
                  <div class="min-w-0">
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap text-[16px]">
                      {{ item.taskName }}
                    </p>
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap text-14px text-[#737478]" v-html="item.taskDescription" />
                  </div>
                  <div class="w-90px flex-shrink-0 text-center text-14px">
                    <p v-if="item.status == 0" class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                      待发布
                    </p>
                    <p v-if="item.status == 1" class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                      进行中
                    </p>
                    <p v-if="item.status == 2" class="rounded-[5px] bg-#F0FFF5 px-7px py-3px text-[#82BD04]">
                      已完成
                    </p>
                    <p v-if="item.status == 3" class="rounded-[5px] bg-#F2F2F2 px-7px py-3px text-[#808080]">
                      已取消
                    </p>
                    <p class="text-[#737478]">
                      {{ item.taskYear }}-{{ item.taskQuarter }}
                    </p>
                  </div>
                </div>
              </div>
            </sar-card>
            <sar-load-more
              :status="loadMoreStatus"
              @load-more="onLoadMore"
              @reload="onReload"
            />
          </sar-pull-down-refresh>
        </scroll-view>
        <sar-floating-bubble
          root-class="!bg-[#ffffff] !w-100px"
          :navbar-height="80"
          @click="toInitiateSupervision"
        >
          <img class="h-20px w-20px" src="@/static/initiate-supervision.png" alt="">
          <p class="text-[14px] text-black">
            发起督办
          </p>
        </sar-floating-bubble>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
