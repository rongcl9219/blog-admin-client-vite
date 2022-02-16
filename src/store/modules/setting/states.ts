import { cacheThemeInfo } from '@/core/storageCache';

export interface SettingState {
    sidebarOpen?: boolean;
    homeAside?: boolean;
    theme?: any;
}

export const state: SettingState = {
    sidebarOpen: false,
    homeAside: false,
    theme: cacheThemeInfo.load() || 'light'
};
