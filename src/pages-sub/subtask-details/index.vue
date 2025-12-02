<script setup lang="ts">
import { formatDate, toast } from 'sard-uniapp'
import { getDictionaryByType } from '@/service/api/common.ts'
import { getSubTaskInfo, subTaskThroughOrDismissed } from '@/service/api/supervising.ts'
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
  userIds: undefined,
  taskId: undefined,
  problemNum: undefined,
  // taskcreateUserId: undefined,
  actualCompletionDate: undefined,
  typeDate: 0,
  type: 0,
  taskHandlingInstructions: undefined,
})
const details = ref<Recordable>({})
const affiliatedType = ref<any[]>([])

const userStore = useUserStore()

const affiliatedTypeName = computed(() => {
  return affiliatedType.value.find(item => item.value == details.value?.businessObject?.affiliatedType)?.label
})

const getDetails = async (id) => {
  const res = await getSubTaskInfo(id)
  console.log(res)
  details.value = res.data
}

const getAffiliatedType = async () => {
  const data = await getDictionaryByType('affiliated_type')
  affiliatedType.value = formatDictField(data.data)
}

const onPassOrReject = async (type) => {
  form.value.type = type
  const res: any = await subTaskThroughOrDismissed(form.value)
  if (res.code === 200) {
    toast.success('操作成功')
    uni.navigateBack()
  }
  else toast.error('操作失败')
}

onLoad(async (options: any) => {
  getAffiliatedType()
  await getDetails(options.id)
  form.value.userIds = [details.value?.createBy]
  form.value.taskId = options.id
  // form.value.taskcreateUserId = details.value?.userId
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between">
    <Header title="子任务详情" />
    <div class="flex-1 overflow-auto p-10px">
      <sar-card root-class="w-full overflow-auto">
        <sar-form :model="form">
          <p class="my-10px text-[16px]">
            {{ details.code }}
          </p>
          <p class="my-10px text-[16px]">
            {{ details.deptName }}
          </p>
          <p class="my-10px text-[16px]">
            所属类型
          </p>
          <p class="text-[15px]">
            {{ affiliatedTypeName }}
          </p>
          <div v-if="details?.businessObject?.affiliatedType == 1">
            <p class="my-10px text-[16px]">
              季度自查问题数量
            </p>
            <sar-form-item inlaid name="problemNum">
              <sar-input v-model="form.problemNum" placeholder="请输入" />
            </sar-form-item>
          </div>

          <p class="my-10px flex items-center justify-between text-[16px]">
            <span>完成期限</span>
          </p>
          <p class="text-[15px]">
            {{ details.completeTime }}
          </p>
          <p class="my-10px flex items-center justify-between text-[16px]">
            <span>最新完成期限</span>
          </p>
          <p class="text-[15px]">
            {{ details.lastDate }}
          </p>
          <p class="my-10px text-[16px]">
            评价依据期限
          </p>
          <sar-form-item inlaid name="type">
            <sar-radio-group v-model="form.typeDate" direction="horizontal">
              <sar-radio size="28rpx" :value="0">
                <span class="text-[14px]">完成期限</span>
              </sar-radio>
              <sar-radio size="28rpx" :value="1">
                <span class="text-[14px]">最新完成期限</span>
              </sar-radio>
            </sar-radio-group>
          </sar-form-item>
          <p class="my-10px text-[16px]">
            实际完成时间
          </p>
          <sar-form-item inlaid name="actualCompletionDate">
            <sar-datetime-picker-input
              v-model="form.actualCompletionDate"
              title="请选择日期"
              placeholder="请选择日期"
              clearable
              value-format="YYYY-MM-DD"
              type="yMd"
            />
          </sar-form-item>
        </sar-form>
      </sar-card>
      <sar-card root-class="mt-10px" title="进度详情">
        <template #extra>
          <p>当前状态: <span class="text-blue">进行中</span></p>
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
    <div v-if="userStore.hasPermissions('taskCompletion:completion:rejectAndConfirm')" class="flex gap-10px bg-white p-15px">
      <sar-button theme="secondary" @click="onPassOrReject(0)">
        驳回
      </sar-button>
      <sar-button theme="primary" @click="onPassOrReject(1)">
        通过
      </sar-button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
