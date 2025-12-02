import * as ww from '@wecom/jssdk'
import { defineStore } from 'pinia'
import { toast } from 'sard-uniapp'
import { getApplySignatures, getCorporateSignature, hasExpiredToken, refreshToken } from '@/service/api/common.ts'
import { getUserInfo, login } from '@/service/api/user.ts'
import { tokenCache } from '@/store/cache.ts'
import { getMetaEnv } from '@/utils/env.ts'

const useUserStore = defineStore('user', () => {
  const userinfo = ref<Recordable>()
  const code = ref<string>()
  const isSecrecyOfficer = ref<boolean>(false)

  async function getUserinfo() {
    const res = await getUserInfo()
    console.log(res)
    if (res.code !== 200)
      return toast(`用户信息获取失败`)

    userinfo.value = {
      permissions: res.permissions,
      roles: res.roles,
      user: res.user,
    }
  }

  const hasPermissions = (key) => {
    return userinfo.value?.permissions?.includes(key)
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

  const refreshToken_ = async () => {
    const res = await refreshToken({ token: tokenCache.get() })
    if (res.code === 200 && res.token)
      tokenCache.set(res.token)
  }

  const isExpiredToken = async () => {
    const res = await hasExpiredToken({ token: tokenCache.get() })
    if (res.data)
      await refreshToken_()
    else {
      tokenCache.remove()
      getCode()
    }
  }

  const enterpriseWeChatRegister = () => {
    const metaEnv = getMetaEnv()
    ww.register({
      corpId: metaEnv.VITE_CORP_ID,
      agentId: metaEnv.VITE_AGENT_ID,
      jsApiList: ['selectEnterpriseContact'],
      async getConfigSignature(url) {
        return ww.getSignature('7mo9kzLF0zXvfXKd2ScDpI-zYMOGLjj_pO3sVe9jY0V_V-s9yV69i71pfoSc4UxHg9DhjMwgraSvPhnollGvAQ')
        console.log(`企业 URL:${url}`)
        const res = await getCorporateSignature(url)
        console.log(res)
      },
      async getAgentConfigSignature(url) {
        return ww.getSignature('yHclwsq+Wfr4i407q2UoCQ==')
        console.log(`应用 URL:${url}`)
        const res = await getApplySignatures(url)
        console.log(res)
      },
      onConfigSuccess() {
        alert('注册成功')
      },
      onConfigFail(err) {
        alert('注册失败')
      },
      onConfigComplete() {
        alert('注册完成')
      },
    })
  }

  const prepare = async () => {
    enterpriseWeChatRegister()
    const searchParams = new URLSearchParams(location.search)
    const codeParams = searchParams.get('code')
    if (tokenCache.get()) {
      await isExpiredToken()
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
    hasPermissions,
    getUserinfo,
    prepare,
    removeUserinfo,
    getCode,
  }
})

export default useUserStore
