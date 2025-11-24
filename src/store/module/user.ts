import { defineStore } from 'pinia'
import { toast } from 'sard-uniapp'
import { getParameterByKey } from '@/service/api/common.ts'
import { getUserInfo, login } from '@/service/api/user.ts'
import { tokenCache } from '@/store/cache.ts'
import { getMetaEnv } from '@/utils/env.ts'

const useUserStore = defineStore('user', () => {
  const userinfo = ref<Recordable>()
  const code = ref<string>()
  const isSecrecyOfficer = ref<boolean>(false)

  // 是否是保密员
  const getSecrecyOfficer = async () => {
    const res = await getParameterByKey('role_confidentiality')
    isSecrecyOfficer.value = userinfo?.roles?.some(item => item.roleKey === res.msg) || false
  }

  async function getUserinfo() {
    const res = await getUserInfo()
    console.log(res)
    userinfo.value = res.data

    await getSecrecyOfficer()
  }

  const weLogin = async () => {
    const res: any = await login({ code: code.value })
    if (res.code === 200 && res.token) {
      tokenCache.set(res.token)
      await getUserinfo()
      uni.switchTab({ url: '/pages/task/index' })
    }
    else
      toast('获取 token 失败')
  }

  const getCode = () => {
    const metaEnv = getMetaEnv()
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${metaEnv.VITE_CORP_ID}&redirect_uri=${location.origin}&response_type=code&scope=snsapi_base&agentid=${metaEnv.VITE_AGENT_ID}#wechat_redirect`
  }

  const prepare = async () => {
    const searchParams = new URLSearchParams(location.search)
    const codeParams = searchParams.get('code')
    console.log(tokenCache.get())
    if (tokenCache.get()) {
      await getUserinfo()
      uni.switchTab({ url: '/pages/task/index' })
      return
    }
    if (!codeParams)
      getCode()
    else {
      code.value = codeParams
      await weLogin()
    }
  }

  const removeUserinfo = () => {
    userinfo.value = undefined
  }

  return {
    userinfo,
    code,
    isSecrecyOfficer,
    getUserinfo,
    prepare,
    removeUserinfo,
    getCode,
  }
})

export default useUserStore
