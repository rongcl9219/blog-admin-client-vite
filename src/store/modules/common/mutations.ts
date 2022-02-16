import { MutationTree } from 'vuex';
import { CommonState } from './states';
import { SET_TOKEN, REFRESH_TOKEN, SET_TOKEN_EXP, SET_WEB_INFO } from './types';

const mutations: MutationTree<CommonState> = {
    [SET_TOKEN]: (state, token: string): void => {
        state.token = token;
    },
    [REFRESH_TOKEN]: (state, refreshToken: string): void => {
        state.refreshToken = refreshToken;
    },
    [SET_TOKEN_EXP]: (state, tokenExp: any): void => {
        state.tokenExp = tokenExp;
    },
    [SET_WEB_INFO]: (state, webInfo: any): void => {
        state.asideWebInfo = webInfo;
    }
};

export default mutations;
