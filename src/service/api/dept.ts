import service from '@/service/request.ts'

// 获取部门树
export function getDeptTree() {
  return service.get(`/system/dept/getDeptTreeAndUserAndRoles`)
}
