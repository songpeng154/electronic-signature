<script setup lang="ts">
import * as ww from '@wecom/jssdk'
import { formatDate, toast } from 'sard-uniapp'
import { getDictionaryByType } from '@/service/api/common.ts'
import { getSupervisingInfo, shareTasks, submitSupervising } from '@/service/api/supervising.ts'
import useUserStore from '@/store/module/user.ts'
import { formatDictField } from '@/utils/dict.ts'

const operationType = {
  CREATE: '新增',
  UPDATE: '修改',
  EXAMINE: '查看',
  ACK: '确认',
  EXPEDITE_SUPERVISE: '催办/督办',
  EXPEDITE: '催办',
  SUPERVISE: '督办',
  SUBMIT: '部门完成情况提交',
  CANCEL: '取消',
}

const form = ref<Recordable>({
  id: undefined,
  userId: undefined,
  taskHandlingInstructions: undefined,
  dataFrom: 'supervisetask',
})
const details = ref<Recordable>({})
const affiliatedType = ref<Recordable[]>([])
const evaluateType = ref<Recordable[]>([])
const userStore = useUserStore()

const departmentName = computed(() => {
  return details.value?.departmentReceivingPersonnelList?.map(item => item.deptName).join(',')
})

const affiliatedTypeName = computed(() => {
  return affiliatedType.value.find(item => item.value == details.value?.affiliatedType)?.label
})

const evaluateTypeName = computed(() => {
  return evaluateType.value.find(item => item.value == details.value?.evaluateType)?.label
})

const toSubtasksList = () => {
  uni.navigateTo({ url: `/pages-sub/subtasks-list/index?id=${details.value.id}` })
}

const getDetails = async (id) => {
  const res = await getSupervisingInfo(id)
  console.log(res)
  details.value = res.data
  form.value.taskId = res.data.id
  form.value.taskCreateUserId = res.data.createBy
}

const getAffiliatedType = async () => {
  const data = await getDictionaryByType('affiliated_type')
  affiliatedType.value = formatDictField(data.data)
}

const getEvaluateType = async () => {
  const data = await getDictionaryByType('evaluate_type')
  evaluateType.value = formatDictField(data.data)
}
const submit = async () => {
  const res = await submitSupervising(form.value)
  if (res.code === 200) {
    toast('提交成功')
    uni.navigateBack()
  }
  else
    toast('提交失败')
}

const share = () => {
  ww.selectEnterpriseContact({
    fromDepartmentId: -1,
    mode: 'multi',
    // type: ['department', 'user'],
    type: ['user'],
    async success(res) {
      const data = await shareTasks({
        userList: res?.result?.userList.map(item => item.id) || [],
        businessId: details.value.id,
        dataFrom: 'supervisetask',
      })
      if (data.code === 200)
        uni.showToast({
          title: '分享成功',
        })
      else
        uni.showToast({
          title: '分享失败',
        })
    },
    fail(res) {
      uni.showToast({
        title: '分享失败',
      })
    },
  })
}

onLoad(async (o) => {
  await userStore.getUserinfo()
  getDetails(o.id)
  getAffiliatedType()
  getEvaluateType()
})

onShow(() => {
  form.value.userId = userStore.userinfo?.user?.userId
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between">
    <Header title="督办详情">
      <template #right>
        <sar-button size="mini" type="text" @click="share">
          分享
        </sar-button>
      </template>
    </Header>
    <div class="flex-1 overflow-auto p-10px">
      <sar-card root-class="w-full overflow-auto">
        <sar-form direction="vertical">
          <p class="mb-5px text-[16px]">
            {{ details.taskNumber }}
          </p><p class="mb-5px text-[16px]">
            任务名称
          </p>
          <p class="mb-10px text-[15px]">
            {{ details.taskName }}
          </p>
          <div class="text-[14px] text-[#9e9e9e]">
            <p>发布日期：{{ details.createTime }}</p>
            <div class="flex items-center justify-between">
              <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                部门：{{ departmentName }}
              </p>
              <sar-button
                inline
                type="pale-text"
                theme="primary"
                @click="toSubtasksList"
              >
                查看更多&gt;
              </sar-button>
            </div>
          </div>
          <p class="mb-5px text-[16px]">
            任务描述
          </p>
          <p class="mb-10px text-[15px]" v-html="details.taskDescription" />
          <p class="mb-5px text-[16px]">
            所属类型
          </p>
          <p class="mb-10px text-[15px]">
            {{ affiliatedTypeName }}
          </p>
          <p class="mb-5px text-[16px]">
            评价类型
          </p>
          <p class="mb-10px text-[15px]">
            {{ evaluateTypeName }}
          </p>
          <p class="mb-5px text-[16px]">
            完成期限
          </p>
          <p class="mb-10px text-[15px]">
            {{ details.completeTime }}
          </p>
          <p class="mb-5px text-[16px]">
            任务年度
          </p>
          <p class="mb-10px text-[15px]">
            {{ details.taskYear }}
          </p>
          <p class="mb-5px text-[16px]">
            任务季度
          </p>
          <p class="mb-10px text-[15px]">
            {{ details.taskQuarter }}
          </p>
          <p class="mb-5px text-[16px]">
            任务办理说明
          </p>
          <sar-form-item inlaid>
            <sar-input v-model="form.taskHandlingInstructions" type="textarea" placeholder="请输入" />
          </sar-form-item>
        </sar-form>
      </sar-card>
      <sar-card root-class="mt-10px" title="操作记录">
        <template #extra>
          <p>
            当前状态:
            <span v-if="details.status === 0" class="text-blue">待发布</span>
            <span v-if="details.status === 1" class="text-blue">进行中</span>
            <span v-if="details.status === 2" class="text-[#82BD04]">已完成</span>
            <span v-if="details.status === 3" class="text-black">已取消</span>
          </p>
        </template>
        <sar-steps direction="vertical">
          <sar-step v-for="(item, i) in details.operationRecordList" :key="i" :index="i">
            <view class="flex items-center justify-between">
              <view>{{ item.operatorName }}-{{ operationType[item.operationType] }}</view>
              <p>
                {{ formatDate(new Date(item.createTime), 'YYYY-MM-DD') }}
              </p>
            </view>
          </sar-step>
        </sar-steps>
      </sar-card>
    </div>
    <div v-if="userStore.hasPermissions('taskCompletion:completion:submit')" class="bg-white p-15px">
      <sar-button @click="submit">
        提交
      </sar-button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
