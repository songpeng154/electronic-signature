// 获取我的电子签计数
import service from '@/service/request.ts'

// 获取督办列表
export function getSupervisingList(params) {
  return service.get('/business/superviseTask/list', { params })
}

// 新增督办
export function addSupervising(data) {
  return service.post('/business/superviseTask', data)
}

// 新增督办
export function updateSupervising(data) {
  return service.put('/business/superviseTask', data)
}

// 获取督办信息
export function getSupervisingInfo(id) {
  return service.get(`/business/superviseTask/${id}`)
}

// 提交督办
export function submitSupervising(data) {
  return service.put(`/taskCompletion/completion/submit`, data)
}

// 获取子任务列表
export function getSubTaskList(params) {
  return service.get('/taskCompletion/completion/list', { params })
}

// 获取子任务详情
export function getSubTaskInfo(id) {
  return service.get(`/taskCompletion/completion/${id}`)
}

// 子任务通过或者驳回
export function subTaskThroughOrDismissed(data) {
  return service.put(`/taskCompletion/completion/rejectAndConfirm`, data)
}

// 分享任务
export function shareTasks(data) {
  return service.post('/taskCompletion/completion/share', data)
}
