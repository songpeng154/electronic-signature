import service from '@/service/request.ts'

// 获取用户信息
export function getUserInfo() {
  return service.get('/system/user/profile')
}

// 登录
export function login(data) {
  return service.post('/wxLogin', data)
}
