import { GetterTree } from 'vuex';
import { SettingState } from './states';
import { RootState } from '../../index.d';

const getters: GetterTree<SettingState, RootState> = {
    getSidebarOpen: (state) => {
        return state.sidebarOpen;
    },
    getHomeAside: (state) => {
        return state.homeAside;
    },
    getTheme: (state) => {
        return state.theme;
    }
};

export default getters;
