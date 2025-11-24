<script setup lang="ts">
import { type LoadMoreStatus, type PullDownRefreshExpose, toast } from 'sard-uniapp'
import { getDictionaryByType } from '@/service/api/common.ts'
import { getSubTaskList } from '@/service/api/supervising.ts'
import useUserStore from '@/store/module/user.ts'
import { formatDictField } from '@/utils/dict.ts'

const query = ref({
  businessId: '',
  dataFrom: 'supervisetask',
  pageNum: 1,
  pageSize: 10,
})
const refreshing = ref(false)
const affiliatedType = ref([])
const total = ref(0)
const pullDownRefresh = ref<PullDownRefreshExpose>()
// 加载更多
const loadMoreStatus = ref<LoadMoreStatus>('incomplete')
const supervisoryList = ref<any[]>([])

const userStore = useUserStore()

const getAffiliatedTypeName = (type) => {
  return affiliatedType.value.find(item => item.value == type)?.label
}

const getAffiliatedType = async () => {
  const data = await getDictionaryByType('affiliated_type')
  affiliatedType.value = formatDictField(data.data)
}

async function getList() {
  const res = await getSubTaskList(query.value)

  total.value = res.total
  return res.rows
}

const toDetails = (id) => {
  if (userStore.isSecrecyOfficer) return toast('无权限')

  uni.navigateTo({ url: `/pages-sub/subtask-details/index?id=${id}` })
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

onLoad((o: any) => {
  query.value.businessId = o.id
})

onShow(() => {
  getAffiliatedType()
  onRefresh()
})
</script>

<template>
  <div class="home h-full w-full flex flex-col justify-between">
    <Header title="子任务列表" />
    <div class="flex flex-1 flex-col gap-10px overflow-hidden p-10px">
      <!--      <sar-input -->
      <!--        v-model="query.value" -->
      <!--        root-class="bg-white !rounded-2xl" -->
      <!--        placeholder="请输入..." -->
      <!--        @blur="onSearch()" -->
      <!--      > -->
      <!--        <template #prepend> -->
      <!--          <sar-icon name="search" /> -->
      <!--        </template> -->
      <!--      </sar-input> -->
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
                      {{ item.deptName }}-{{ item.nickName }}
                    </p>
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap text-14px text-[#737478]">
                      所属类型：{{ getAffiliatedTypeName(item?.businessObject?.affiliatedType) }}
                    </p>
                  </div>
                  <div class="w-90px flex-shrink-0 text-center text-14px">
                    <p v-if="item.status === 0" class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                      待接收
                    </p>
                    <p v-if="item.status === 1" class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                      已查看
                    </p>
                    <p v-if="item.status === 2" class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                      已确认
                    </p>
                    <p v-if="item.status === 3" class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                      已提交
                    </p>
                    <p v-if="item.status === 4" class="rounded-[5px] bg-#F0FFF5 px-7px py-3px text-[#82BD04]">
                      已完成
                    </p>
                    <p v-if="item.status === 5" class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                      已驳回
                    </p>
                    <p class="text-[#737478]">
                      {{ item.createTime }}
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
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
