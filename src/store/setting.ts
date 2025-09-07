import { defineStore } from 'pinia'
import { cacheThemeInfo } from '@/core/storageCache'

interface SettingState {
    sidebarOpen?: boolean;
    theme?: any;
}

export const useSettingStore = defineStore('setting', {
  state: (): SettingState => ({
    sidebarOpen: false,
    theme: cacheThemeInfo.load() || 'light'
  }),
  getters: {
    getSidebarOpen: state => state.sidebarOpen,
    getTheme: state => state.theme
  },
  actions: {
    toggleSideBar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    setTheme(theme: any) {
      cacheThemeInfo.save(theme)
      this.theme = theme
    }
  }
})
