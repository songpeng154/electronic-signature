import service from '@/service/request.ts'

// 根据字典类型查询字典数据信息
export function getDictionaryByType(type: any) {
  return service.get(`/system/dict/data/type/${type}`)
}

// 根据参数键名查询参数值
export function getParameterByKey(key: any) {
  return service.get(`/system/config/configKey/${key}`)
}

// 刷新 token
export function refreshToken(data) {
  return service.post(`/reGetToken`, data)
}

// token 是否过期
export function hasExpiredToken(data) {
  return service.post('/isToken', data)
}
