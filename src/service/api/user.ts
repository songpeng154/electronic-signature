import service from '@/service/request.ts'

// 获取用户信息
export function getUserInfo() {
  return service.get('/getInfo')
}

// 登录
export function login(data) {
  return service.post('/wxLogin', data)
}
