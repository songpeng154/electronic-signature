<script setup lang="ts">
import { getDictionaryByType } from '@/service/api/common.ts'
import { getDeptScores } from '@/service/api/evaluation.ts'
import { formatDictField } from '@/utils/dict.ts'

const list = ref<Recordable[]>([])
const affiliatedType = ref<Recordable[]>([])

const getScore = async (data) => {
  const res = await getDeptScores(data)
  console.log(res)
  list.value = res.rows
  console.log(data.value)
}

const getAffiliatedTypeName = (value) => {
  return affiliatedType.value.find(item => item.value == value.affiliatedType)?.label
}

const getAffiliatedType = async () => {
  const data = await getDictionaryByType('affiliated_type')
  affiliatedType.value = formatDictField(data.data)
}

onLoad(async (o: any) => {
  console.log(o)
  // data.value = Object.keys(o).map((key) => {
  //   let title
  //   switch (key) {
  //     case 'training':
  //       title = '培训'
  //       break
  //     case 'supervision':
  //       title = '监督检查'
  //       break
  //     case 'assessment':
  //       title = '年度考核'
  //       break
  //     case 'deptSelfInspection':
  //       title = '部门自查'
  //       break
  //     case 'rectification':
  //       title = '问题整改'
  //       break
  //     case 'summary':
  //       title = '工作总结'
  //       break
  //     case 'archives':
  //       title = '二级档案'
  //       break
  //     case 'other':
  //       title = '其他'
  //   }
  //   return {
  //     title,
  //     key,
  //     value: o[key],
  //   }
  // })
  await getAffiliatedType()
  getScore({ deptId: o.deptId, year: o.year })
})
</script>

<template>
  <div class="home h-full w-full flex flex-col justify-between">
    <Header title="得分" />
    <div class="flex flex-1 flex-col gap-10px overflow-auto p-10px">
      <sar-card
        v-for="(item, i) in list"
        :key="i"
        :value="item.value"
        root-class=" w-full"
      >
        <div class="w-full flex items-center justify-between gap-10px">
          <img class="h-60px w-60px rounded-full" src="@/static/score-item.png" alt="">
          <div class="flex flex-1 items-center justify-between gap-10px overflow-hidden">
            <div class="min-w-0">
              <p class="overflow-hidden text-ellipsis whitespace-nowrap text-[16px]">
                {{ item.deptName }}-{{ item.name }}
              </p>
              <p class="overflow-hidden text-ellipsis whitespace-nowrap text-14px text-[#737478]">
                {{ getAffiliatedTypeName(item) }}
              </p>
            </div>
            <div class="w-90px flex-shrink-0 text-center text-14px">
              <p class="text-[#737478]">
                {{ item.createTime }}
              </p>
              <p class="rounded-[5px] bg-#F0F6FF px-7px py-3px text-[#1377FF]">
                得分：{{ item.score }}
              </p>
            </div>
          </div>
        </div>
      </sar-card>
    </div>
  </div>
</template>

<style scoped>

</style>
