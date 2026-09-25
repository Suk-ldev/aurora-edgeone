import { getGlobalConfig, getUserConfig, getUserInfo } from '../apis/auth'

const state = {
  globalConfig: {}, // 全局配置
  userConfig: {}, // 用户配置
  userInfo: {}, // 用户信息
  alertFlag: false // 是否已弹窗
}

const mutations = {
  SET_GLOBAL_CONFIG: (state, globalConfig) => {
    state.globalConfig = globalConfig
  },
  SET_USER_CONFIG: (state, userConfig) => {
    state.userConfig = userConfig
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ALERT_FLAG: (state, alertFlag) => {
    state.alertFlag = alertFlag
  }
}

const actions = {
  /**
   * 获取全局配置
   */
  async getGlobalConfig({ commit }) {
    const res = await getGlobalConfig()
    commit('SET_GLOBAL_CONFIG', res.data)
  },

  /**
   * 获取用户配置
   */
  async getUserConfig({ commit }) {
    const res = await getUserConfig()
    commit('SET_USER_CONFIG', res.data)
  },

  /**
   * 获取用户信息
   */
  async getUserInfo({ commit }) {
    const res = await getUserInfo()
    if (window.$crisp) {
      window.$crisp.push(['set', 'user:email', [res.data.email]])
      window.$crisp.push(['set', 'session:data', [[['Balance', res.data.balance / 100]]]])
    }
    commit('SET_USER_INFO', res.data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
