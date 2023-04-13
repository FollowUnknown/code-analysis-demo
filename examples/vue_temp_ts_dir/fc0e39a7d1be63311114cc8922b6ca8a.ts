
// 引入API
import { vipApi, authApi } from '@/api/api'
import authUtils from '@/utils/authUtils'

export default {
  name: 'loginSuccess',
  created() {
    //  重新登录成功后关闭该页面
    this.getVersion()
  },
  methods: {
    async getVersion() {
      const oldVersion = localStorage.getItem('runtime_version')
      localStorage.removeItem('runtime_login_success')
      const authUserData = (await authApi.getSessionData()).data
      const oldId = localStorage.getItem('runtime_user_id')
      if (authUserData.code === 0) {
        const { id } = authUserData.data
        authUtils.setLocalUserData(authUserData.data)
        if (oldId && oldId !== id) {
          localStorage.setItem('runtime_login_success', '1')
          localStorage.setItem('runtime_refreshWeb', '2')
          window.close()
          return
        }
      }
      const res = (await vipApi.getVersion()).data
      try {
        if (res.code === 0) {
          const version = res.data
          localStorage.setItem('runtime_login_success', '1')
          localStorage.setItem('runtime_version', version)
          if (version !== oldVersion) {
            localStorage.setItem('runtime_refreshWeb', '1')
          }
        }
      } catch (error) {
        //  设置是否重载该页面
        localStorage.setItem('runtime_refreshWeb', '1')
        console.log(error)
      }
      window.close()
    }
  }
}
