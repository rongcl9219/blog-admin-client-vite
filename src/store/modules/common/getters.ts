import { GetterTree } from 'vuex';
import { CommonState } from './states';
import { RootState } from '../../index.d';

const getters: GetterTree<CommonState, RootState> = {
    getToken: (state) => {
        return state.token;
    },
    getRefreshToken: (state) => {
        return state.refreshToken;
    },
    getTokenExp: (state) => {
        return state.tokenExp;
    },
    getWebInfo: (state) => {
        return state.asideWebInfo;
    }
};

export default getters;
