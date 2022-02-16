import { ActionTree, Commit } from 'vuex';
import { SET_SIDEBAR, SET_HOME_ASIDE, SET_THEME } from './types';
import { cacheThemeInfo } from '@/core/storageCache';
import { SettingState } from './states';
import { RootState } from '../../index.d';

const actions: ActionTree<SettingState, RootState> = {
    toggleSideBar({ commit }: { commit: Commit }) {
        commit(SET_SIDEBAR);
    },
    toggleHomeAside({ commit }: { commit: Commit }) {
        commit(SET_HOME_ASIDE);
    },
    setTheme({ commit }: { commit: Commit }, theme: any) {
        cacheThemeInfo.save(theme);
        commit(SET_THEME, theme);
    }
};

export default actions;
