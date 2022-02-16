import { ActionTree, Commit, Dispatch } from 'vuex';
import { CommonState } from './states';
import { RootState } from '../../index.d';
import { CommonApi } from '@/api';
import { SET_TOKEN, REFRESH_TOKEN, SET_TOKEN_EXP, SET_WEB_INFO } from './types';
import {
    cacheAccessToken,
    cacheRefreshToken,
    cacheTokenExp
} from '@/core/storageCache';
import { CustomResponse } from '@/core/request/type';

const actions: ActionTree<CommonState, RootState> = {
    /**
     * 刷新token
     */
    async refreshToken({ dispatch }: { dispatch: Dispatch }): Promise<CustomResponse> {
        return new Promise((resolve, reject) => {
            CommonApi.refreshToken()
                .then((response) => {
                    dispatch('setToken', response.data).then();
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    /**
     * 设置token
     */
    setToken({ commit }: { commit: Commit }, tokenInfo: any): void {
        const { accessToken, refreshToken, exp } = tokenInfo;
        const dateNow = new Date().getTime();
        const tokenExpireTime = dateNow + exp;

        commit(SET_TOKEN, accessToken);
        commit(REFRESH_TOKEN, refreshToken);
        commit(SET_TOKEN_EXP, tokenExpireTime);
        cacheAccessToken.save(accessToken);
        cacheRefreshToken.save(refreshToken);
        cacheTokenExp.save(tokenExpireTime);
    },
    /**
     * 清除token
     */
    clearToken({ commit }: { commit: Commit }): void {
        commit(SET_TOKEN, null);
        commit(REFRESH_TOKEN, null);
        commit(SET_TOKEN_EXP, null);
        cacheAccessToken.delete();
        cacheRefreshToken.delete();
        cacheTokenExp.delete();
    },
    /**
     * 设置网站信息
     */
    async setWebInfo({ commit }: { commit: Commit }): Promise<CustomResponse> {
        return new Promise((resolve, reject) => {
            CommonApi.getAsideInfo()
                .then((response) => {
                    commit(SET_WEB_INFO, response.data);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

export default actions;
