import service from '@/service/request.ts'

// 获取通知列表
export function getNoticeList(params) {
  return service.get('/notification/notification/list', { params })
}

// 新增通知
export function addNotice(data) {
  return service.post('/notification/notification', data)
}

// 获取通知信息
export function getNoticeInfo(id) {
  return service.get(`/notification/notification/${id}`)
}
