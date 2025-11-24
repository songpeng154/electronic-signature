import service from '@/service/request.ts'

// 获取考核列表
export function getEvaluationList(params) {
  return service.get(`/evaluation/result/list`, { params })
}

// 获取考核详情
export function getEvaluationDetails(params) {
  return service.get(`/evaluation/result/deptResultDetail`, { params })
}

// 获取排名分类
export function getEvaluationType() {
  return service.get(`/system/dept/getSecondaryDeptList`)
}

// 获取部门得分
export function getDeptScores(params) {
  return service.get(`/evaluation/result/getScoreListByDept`, { params })
}
