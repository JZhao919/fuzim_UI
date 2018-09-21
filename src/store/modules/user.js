import { login, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth' // 从Cookie中存取Token

const user = {
  state: {
    username: '',
    cname: '',
    token: getToken(),
    roles: [],
    avatar: '',
    status: 0,
    note: ''
  },

  mutations: {
    SET_USERNAME: (state, username) => {
      state.name = name
    },
    SET_CNAME: (state, cname) => {
      state.cname = cname
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_NOTE: (state, note) => {
      state.introduction = note
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_STATUS: (state, status) => {
      state.status = status
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const data = response.data
          if (data.role && data.roles !== '') { // 验证返回的roles是否是一个非空数组
            var roles = []
            roles[0] = data.role + ''
            commit('SET_ROLES', roles)
          } else {
            reject('getInfo: roles must be a non-null string !')
          }
          commit('SET_USERNAME', data.username)
          commit('SET_CNAME', data.cname)
          commit('SET_AVATAR', data.avatar)
          commit('SET_NOTE', data.note)
          commit('SET_STATUS', data.status)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USERNAME', '')
        commit('SET_CNAME', '')
        commit('SET_AVATAR', '')
        commit('SET_NOTE', '')
        commit('SET_STATUS', 0)
        removeToken()
        resolve()
      })
    }
  }
}

export default user
