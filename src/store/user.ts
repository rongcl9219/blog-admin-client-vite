import { defineStore } from 'pinia'
import { CommonApi, UserApi } from '@/api'
import type { CustomResponse } from '@/core/request/type'
import { cacheAccessToken } from '@/core/cookieCache'
import { cacheRefreshToken, cacheTokenExp } from '@/core/storageCache'

interface UserState {
    username?: string;
    avatar?: string;
    token?: any;
    refreshToken?: any;
    tokenExp?: any;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    username: '',
    avatar: '',
    token: cacheAccessToken.load() || null,
    refreshToken: cacheRefreshToken.load() || null,
    tokenExp: cacheTokenExp.load() || null
  }),
  getters: {
    getUsername: state => state.username,
    getAvatar: state => state.avatar,
    getToken: state => state.token,
    getRefreshToken: state => state.refreshToken,
    getTokenExp: state => state.tokenExp
  },
  actions: {
    /**
         * 用户登录
         * @param userInfo
         */
    login(userInfo: any): Promise<CustomResponse> {
      const { username, password } = userInfo
      return new Promise<CustomResponse>((resolve, reject) => {
        UserApi.login(username, password)
          .then((response) => {
            this.setToken(response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
         * 获取用户信息
         */
    getUserInfo(): Promise<CustomResponse> {
      return new Promise<CustomResponse>((resolve, reject) => {
        UserApi.getUserInfo()
          .then((response) => {
            const { userName, avatarUrl } = response.data.userInfo
            this.username = userName
            this.avatar = avatarUrl
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
         * 退出登录
         */
    loginOut(): Promise<CustomResponse> {
      this.clearToken()
      this.username = ''
      this.avatar = ''
      return new Promise<CustomResponse>((resolve, reject) => {
        UserApi.loginOut()
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
         * 设置用户头像
         * @param avatarUrl
         */
    setUserAvatar(avatarUrl: string): void {
      this.avatar = avatarUrl
    },
    /**
         * 刷新token
         */
    async refreshToken(): Promise<CustomResponse> {
      return new Promise((resolve, reject) => {
        CommonApi.refreshToken()
          .then((response) => {
            this.setToken(response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
         * 设置token
         * @param tokenInfo
         */
    setToken(tokenInfo: any): void {
      const { accessToken, refreshToken, exp } = tokenInfo
      const dateNow = new Date().getTime()
      const tokenExpireTime = dateNow + exp
      this.token = accessToken
      this.refreshToken = refreshToken
      this.tokenExp = tokenExpireTime
      cacheAccessToken.save(accessToken)
      cacheRefreshToken.save(refreshToken)
      cacheTokenExp.save(tokenExpireTime)
    },
    /**
         * 清除token
         */
    clearToken(): void {
      this.token = null
      this.refreshToken = null
      this.tokenExp = null
      cacheAccessToken.delete()
      cacheRefreshToken.delete()
      cacheTokenExp.delete()
    }
  }
})
