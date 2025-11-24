<script setup lang="ts">
import { type FormExpose, toast, type TreeExpose } from 'sard-uniapp'
import { getDictionaryByType } from '@/service/api/common.ts'
import { getDeptTree } from '@/service/api/dept.ts'
import { addSupervising, getSupervisingInfo, updateSupervising } from '@/service/api/supervising.ts'
import { formatDictField } from '@/utils/dict.ts'

const quarterList = [
  {
    value: '第一季度',
    label: '第一季度',
  },
  {
    value: '第二季度',
    label: '第二季度',
  },
  {
    value: '第三季度',
    label: '第三季度',
  },
  {
    value: '第四季度',
    label: '第四季度',
  },
]

const formRef = ref<FormExpose>()
const treeRef = ref<TreeExpose>()
const form = ref<Recordable>({
  taskName: undefined,
  taskDescription: undefined,
  affiliatedType: undefined,
  evaluateType: undefined,
  taskYear: undefined,
  taskQuarter: undefined,
  status: 0,
  userIds: [],
})

const id = ref()
const affiliatedType = ref<any[]>([])
const evaluateType = ref<any[]>([])
const deptList = ref<any[]>([])
const deptVisible = ref(false)
const deptName = ref('')
const rules = ref({
  taskName: [
    {
      required: true,
      message: '请输入任务名称',
      trigger: 'blur',
    },
  ],
  taskDescription: [
    {
      required: true,
      message: '请输入任务描述',
      trigger: 'blur',
    },
  ],
  affiliatedType: [
    {
      required: true,
      message: '请选择所属类型',
      trigger: 'change',
    },
  ],
  evaluateType: [
    {
      required: true,
      message: '请选择评价类型',
      trigger: 'change',
    },
  ],
  taskYear: [
    {
      required: true,
      message: '请选择年份',
      trigger: 'change',
    },
  ],
  taskQuarter: [
    {
      required: true,
      message: '请选择季度',
      trigger: 'change',
    },
  ],
  userIds: [
    {
      required: true,
      message: '请选择接收部门/人员',
      trigger: 'change',
    },
  ],
})

const getAffiliatedType = async () => {
  const data = await getDictionaryByType('affiliated_type')
  affiliatedType.value = formatDictField(data.data)
}

const getEvaluateType = async () => {
  const data = await getDictionaryByType('evaluate_type')
  evaluateType.value = formatDictField(data.data)
}

const getDeptList = async () => {
  const res = await getDeptTree()
  console.log(res)
  deptList.value = transformTreeDataDetailed(res.data)
  console.log(deptList.value)
}

function transformTreeDataDetailed(treeData: any[]) {
  if (!Array.isArray(treeData))
    return []

  // 递归处理函数，用于转换单个节点
  const processNode = (node) => {
    // --- 转换部门节点 ---
    const transformedDept = {
      key: node.deptId,
      title: node.deptName,
      parentId: node.parentId,
      // disabled: true, // 为部门节点添加 disabled: true
    }

    // --- 转换人员节点 ---
    const personNodes = (node.persons || []).map(person => ({
      key: `user${person.userId}`, // userId -> id, 并加前缀
      title: person.nickName, // nickName -> name
      parentId: node.deptId, // 父节点ID是当前部门的ID
      // 人员节点没有 disabled 属性，因此是可选的
      // 也可以保留原始数据以备后用
      originalPersonData: person,
    }))

    // --- 递归转换子部门节点 ---
    const childrenNodes = (node.children || []).map(child => processNode(child))

    // --- 合并子节点和人员节点 ---
    transformedDept.children = [...childrenNodes, ...personNodes]
    // 如果一个部门既没有子部门也没有人员，children 数组将为空
    if (transformedDept.children.length === 0)
      transformedDept.children = null // 或者 []，根据您的需要

    return transformedDept
  }

  // 从顶层节点开始转换
  return treeData.map(rootNode => processNode(rootNode))
}

/**
 * 这是一个递归辅助函数，用于在节点数组中查找指定ID的名称。
 * @param {Array} nodes - 要搜索的节点数组。
 * @param {string|number} key - 要查找的ID。
 * @returns {string|null} - 如果找到，返回对应的名称；否则返回null。
 */
function findNameInTree(nodes, key) {
  // 遍历当前层级的每一个节点
  for (const node of nodes) {
    // 检查当前节点的ID是否匹配（统一转换为字符串进行比较）
    if (String(node.key) === String(key))
      return node.title

    // 如果当前节点有子节点，则递归进入子节点中查找
    if (node.children) {
      const foundName = findNameInTree(node.children, key)
      // 如果在子节点中找到了，立即返回结果
      if (foundName !== null)
        return foundName
    }
  }
  // 如果遍历完所有节点及其子节点都未找到，返回null
  return null
}

/**
 * 根据ID数组，在转换后的树中查找对应的节点名称。
 * (此版本通过直接递归搜索实现，以确保稳健性)
 * @param {Array} transformedTree - 经过 `transformTreeDataDetailed` 函数处理后的树数据。
 * @param {Array<string|number>} idsArray - 一个包含ID（字符串或数字）的数组 (例如: [108, "user102", 202])。
 * @returns {string} - 一个由查找到的名称组成的、以逗号分隔的字符串。
 */
function getNamesByIds(transformedTree, idsArray) {
  if (!Array.isArray(idsArray) || idsArray.length === 0)
    return ''

  const names = idsArray
    .map(id => findNameInTree(transformedTree, id)) // 为每个ID调用递归搜索函数
    .filter(name => name !== null) // 过滤掉未找到的结果

  return names.join(',')
}

const openDeptPopout = () => {
  deptVisible.value = true
}

const onDeptConfirm = () => {
  console.log(treeRef.value?.getCheckedKeys())
  const userIds = treeRef.value
    ?.getCheckedKeys()
    .filter(item => String(item).startsWith('user'))
  form.value.userIds = userIds?.map(item => Number(String(item).replace('user', '')))
  deptName.value = getNamesByIds(deptList.value, userIds)
}

const temporarily = async () => {
  await formRef.value?.validate()
  form.value.status = 0
  const res = await addSupervising(form.value)
  if (res.code === 200)
    toast('暂存成功')
  else
    toast('暂存失败')
}

const submit = async () => {
  await formRef.value?.validate()
  form.value.status = 1
  let res
  if (form.value.id)
    res = await updateSupervising(form.value)
  else
    res = await addSupervising(form.value)

  if (res.code === 200) {
    toast('发布成功')
    uni.navigateBack()
  }
  else
    toast('发布失败')
}

const getDetails = async (id) => {
  const res = await getSupervisingInfo(id)
  console.log(res)
  form.value.id = res.data.id
  form.value.taskName = res.data.taskName
  form.value.taskDescription = res.data.taskDescription
  form.value.taskYear = res.data.taskYear
  form.value.taskQuarter = res.data.taskQuarter
  form.value.affiliatedType = res.data.affiliatedType
  form.value.evaluateType = res.data.evaluateType
  form.value.userIds = res.data.userIds
  deptName.value = getNamesByIds(deptList.value, form.value.userIds)
  treeRef.value?.setCheckedKeys(form.value.userIds.map(item => `user${item}`))
}

onLoad(async (options: any) => {
  await Promise.all([getAffiliatedType(), getEvaluateType(), getDeptList()])

  if (options.id) {
    form.value.id = options.id
    await getDetails(options.id)
  }
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between">
    <Header title="发起督办">
      <template #right>
        <sar-button type="pale-text" @click="temporarily">
          <img class="h-20px w-20px" src="@/static/save.png" alt="">
        </sar-button>
      </template>
    </Header>
    <div class="flex-1 overflow-hidden p-10px">
      <sar-card root-class="flex-1 h-full overflow-auto">
        <sar-form
          ref="formRef"
          direction="vertical"
          :model="form"
          :rules="rules"
        >
          <sar-form-item label="任务名称" name="taskName">
            <sar-input
              v-model="form.taskName"
              clearable
              placeholder="请输入"
            />
          </sar-form-item>
          <sar-form-item label="任务描述" name="taskDescription">
            <sar-input
              v-model="form.taskDescription"
              clearable
              type="textarea"
              placeholder="请输入"
            />
          </sar-form-item>
          <sar-form-item label="所属类型" name="affiliatedType">
            <sar-picker-input
              v-model="form.affiliatedType"
              clearable
              placeholder="请选择"
              :columns="affiliatedType"
            />
          </sar-form-item>
          <sar-form-item label="评价类型" name="evaluateType">
            <sar-picker-input
              v-model="form.evaluateType"
              clearable
              placeholder="请选择"
              :columns="evaluateType"
            />
          </sar-form-item>
          <sar-form-item label="年度" name="taskYear">
            <sar-datetime-picker-input
              v-model="form.taskYear"
              title="请选择年度"
              placeholder="请选择"
              clearable
              value-format="YYYY"
              type="y"
            />
          </sar-form-item>
          <sar-form-item label="季度" name="taskQuarter">
            <sar-picker-input
              v-model="form.taskQuarter"
              clearable
              placeholder="请选择"
              :columns="quarterList"
            />
          </sar-form-item>

          <sar-form-item label="接收部门/人员" name="userIds">
            <sar-popout-input
              v-model="deptName"
              multiline
              placeholder="请选择"
              @click="openDeptPopout"
            />
          </sar-form-item>
        </sar-form>
      </sar-card>
    </div>
    <div class="bg-white p-15px">
      <sar-button @click="submit">
        发布
      </sar-button>
    </div>
  </div>
  <sar-popout
    v-model:visible="deptVisible"
    title="标题"
    @confirm="onDeptConfirm"
  >
    <div class="max-h-[60vh] overflow-auto">
      <sar-tree ref="treeRef" selectable :data="deptList" />
    </div>
  </sar-popout>
</template>

<style scoped lang="scss">

</style>
