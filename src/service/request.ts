import { createUniAppAxiosAdapter } from '@uni-helper/axios-adapter'
import axios from 'axios'
import { tokenCache } from '@/store/cache.ts'
import useUserStore from '@/store/module/user.ts'
import { getServicePrefixOrUrl } from '@/utils/env.ts'

const service = axios.create({
  baseURL: getServicePrefixOrUrl('BASE'),
  timeout: 10000,
  adapter: createUniAppAxiosAdapter(),
})

service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${tokenCache.get()}`
    // config.headers.Authorization = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImxvZ2luX3VzZXJfa2V5IjoiMzQ0OGJmNmEtZmU0My00NzE3LWFkNmQtZDkxNDM5ZmQzMTlhIn0.C2Bvtx5rLqPpfNQn2uRA3zvNiZdE0ZkbKs5BqSttgr6jZuqAYwZeq_HLKnxA2oo__G3ougs5-cKnuF-zhFMMSA'

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use((response) => {
  const userStore = useUserStore()
  const data = response.data
  if (data.code === 401) {
    uni.showToast({ title: '未授权，请重新登录', icon: 'none', duration: 2000 })
    tokenCache.remove()
    userStore.getCode()
  }

  else if (data.code !== 200) {
    uni.showToast({ title: data.msg || '服务器异常，请稍后重试', icon: 'none', duration: 2000 })
    return Promise.reject(data.msg)
  }

  return data
})

export default service
