<script setup lang="ts">
import type { TabOption } from 'sard-uniapp'
import { getEvaluationList, getEvaluationType } from '@/service/api/evaluation.ts'
import useUserStore from '@/store/module/user.ts'

const query = ref({
  deptId: '1',
  year: new Date().getFullYear() + 1,
})

const tabs = ref<TabOption[]>([])
const dpartment = ref<Recordable>()
const deptList = ref<any[]>([])
const userStore = useUserStore()
console.log(userStore)

const toDetails = (item) => {
  const { baseScore, coefficient, resultBaseScore, extraPoint, totalScore, ranking, deptId, deptName, year } = item
  const query = {
    baseScore,
    coefficient,
    resultBaseScore,
    extraPoint,
    totalScore,
    ranking,
    deptId,
    deptName,
    year,
  }

  const urlSearchParams = new URLSearchParams(query)

  uni.navigateTo({ url: `/pages-sub/evaluation-details/index?${urlSearchParams.toString()}` })
}

const getTypeList = async () => {
  const res = await getEvaluationType()
  console.log(res)
  tabs.value = res.data.map((item) => {
    return {
      title: item.deptName,
      name: item.deptId,
    }
  })
  query.value.deptId = res.data[0].deptId
  console.log(tabs.value)
}

const getList = async () => {
  const res = await getEvaluationList(query.value)
  console.log(res)
  dpartment.value = res.rows.find(item => item.deptId === userStore.userinfo?.user?.deptId)

  const list = res.rows.filter((item) => {
    return item.ranking && (item.ranking === 1 || item.ranking === 2 || item.ranking === 3)
  })

  list.sort((a, b) => {
    return a.ranking - b.ranking
  })
  deptList.value = list
}

const toScore = () => {
  if (!dpartment.value) return
  const { training, supervision, assessment, deptSelfInspection, rectification, summary, archives, other } = dpartment.value
  // const query = {
  //   training,
  //   supervision,
  //   assessment,
  //   deptSelfInspection,
  //   rectification,
  //   summary,
  //   archives,
  //   other,
  // }
  // Object.keys(query).forEach((key) => {
  //   if (!query[key]) query[key] = 0
  // })
  const { deptId, deptName, year } = dpartment.value
  const query = {
    deptId,
    deptName,
    year,
  }

  const urlSearchParams = new URLSearchParams(query)

  uni.navigateTo({ url: `/pages-sub/score/index?${urlSearchParams.toString()}` })
}
onLoad(async () => {
  await userStore.getUserinfo()
  await getTypeList()
  await getList()
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <Header hide-back title="评价考核" />
    <sar-tabs
      v-model:current="query.deptId"
      scrollable
      class="mb-10px"
      :list="tabs"
      @change="getList()"
    />
    <div class="flex-1 overflow-auto p-10px pt-0">
      <sar-card v-if="dpartment" root-class="mb-10px w-full card" @click="toDetails(dpartment)">
        <div class="w-full flex items-center justify-between gap-10px">
          <div class="h-60px w-60px flex items-center justify-center rounded-full bg-[#F1F9FF]">
            <img class="w-15px" src="@/static/infinite.png" alt="">
          </div>
          <div class="flex flex-1 items-center justify-between gap-10px overflow-hidden">
            <div class="min-w-0">
              <p class="overflow-hidden text-ellipsis whitespace-nowrap text-[16px]">
                本部门
              </p>
              <p class="overflow-hidden text-ellipsis whitespace-nowrap text-14px text-[#737478]">
                年度：{{ dpartment.year }}
              </p>
            </div>
            <div class="flex-shrink-0 text-center text-14px">
              <p class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                综合得分：{{ dpartment.totalScore }}
              </p>
            </div>
          </div>
        </div>
      </sar-card>

      <sar-card
        v-for="(item, i) in deptList"
        :key="item.id"
        root-class="mb-10px w-full"
      >
        <div class="w-full flex items-center justify-between gap-10px">
          <div class="h-60px w-60px flex items-center justify-center rounded-full bg-[#F1F9FF]">
            <img class="w-20px" :src="`/static/num-${i + 1}.png`" alt="">
          </div>
          <div class="flex flex-1 items-center justify-between gap-10px overflow-hidden">
            <div class="min-w-0">
              <p class="overflow-hidden text-ellipsis whitespace-nowrap text-[16px]">
                {{ item.deptName }}
              </p>
              <p class="overflow-hidden text-ellipsis whitespace-nowrap text-14px text-[#737478]">
                年度：{{ item.year }}
              </p>
            </div>
            <div class="flex-shrink-0 text-center text-14px">
              <p class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                综合得分：{{ item.totalScore }}
              </p>
            </div>
          </div>
        </div>
      </sar-card>
      <div v-if="!dpartment && !deptList.length" class="text-center">
        无排名数据
      </div>
      <sar-floating-bubble
        root-class="!bg-[#ffffff] !w-100px"
        :navbar-height="80"
        @click="toScore"
      >
        <img class="h-20px w-20px" src="@/static/score.png" alt="">
        <p class="text-[14px] text-black">
          得分
        </p>
      </sar-floating-bubble>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card{
  box-shadow: 0px 2px 9px 2px #9ab4e1;
}
</style>
