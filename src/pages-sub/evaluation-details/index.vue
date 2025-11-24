<script setup lang="ts">
import { omit } from 'es-toolkit'
import { getEvaluationDetails } from '@/service/api/evaluation.ts'

const dept = ref<Recordable>({})
const details = ref({})
const deptBase = ref([])

const getDetails = async (query) => {
  const res = await getEvaluationDetails(query)
  details.value = res.data
}

onLoad((o: any) => {
  dept.value = o
  deptBase.value = Object.keys(omit(o, ['deptName', 'deptId', 'year'])).map((key) => {
    console.log(key)
    let title
    switch (key) {
      case 'baseScore':
        title = '基础得分'
        break
      case 'coefficient':
        title = '综合系数'
        break
      case 'resultBaseScore':
        title = '考核基础得分'
        break
      case 'extraPoint':
        title = '附加分'
        break
      case 'totalScore':
        title = '综合得分'
        break
      case 'ranking':
        title = '排行'
        break
    }

    return {
      title,
      key,
      value: o[key],
    }
  })

  getDetails({ deptId: o.deptId, year: o.year })
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between">
    <Header title="评价总分详情" />
    <div class="flex-1 overflow-auto p-10px">
      <sar-card :title="dept.deptName">
        <div class="grid-container">
          <div v-for="item in deptBase" :key="item.key" class="item">
            <p class="mb-10px text-[#333333]">
              {{ item.title }}
            </p>
            <p class="text-[#1377FF]">
              {{ item.value }}
            </p>
          </div>
        </div>
      </sar-card>
      <sar-card
        v-for="(item, i) in details"
        :key="i"
        :title="item.title"
        root-class="mt-10px"
      >
        <div class="grid-container">
          <div v-for="(value, ii) in item.children" :key="ii" class="item">
            <p class="mb-10px text-[#333333]">
              {{ value.name }}
            </p>
            <p class="text-[#1377FF]">
              {{ value.value }}
            </p>
          </div>
        </div>
      </sar-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 2;
  margin-bottom: 10px;
}
</style>
