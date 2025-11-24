import service from '@/service/request.ts'

// 根据字典类型查询字典数据信息
export function getDictionaryByType(type: any) {
  return service.get(`/system/dict/data/type/${type}`)
}

// 根据参数键名查询参数值
export function getParameterByKey(key: any) {
  return service.get(`/system/config/configKey/${key}`)
}
