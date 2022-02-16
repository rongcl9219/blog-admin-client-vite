import { MutationTree } from 'vuex';
import { SettingState } from './states';
import { SET_SIDEBAR, SET_HOME_ASIDE, SET_THEME } from './types';

const mutations: MutationTree<SettingState> = {
    [SET_SIDEBAR]: (state) => {
        state.sidebarOpen = !state.sidebarOpen;
    },
    [SET_HOME_ASIDE]: (state) => {
        state.homeAside = !state.homeAside;
    },
    [SET_THEME]: (state, theme: any) => {
        state.theme = theme;
    }
};

export default mutations;
