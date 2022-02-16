import { Commit, Dispatch, ActionTree } from 'vuex';
import { UserApi } from '@/api';
import { CustomResponse } from '@/core/request/type';
import { UserState } from './states';
import { RootState } from '../../index.d';
import { SET_AVATAR, SET_USERNAME, RESET_USER_STATE } from '@/store/modules/user/types';

const actions: ActionTree<UserState, RootState> = {
    /**
     * 用户登录
     */
    login({ dispatch }: { dispatch: Dispatch }, userInfo: any): Promise<CustomResponse> {
        const { username, password } = userInfo;

        return new Promise<CustomResponse>((resolve, reject) => {
            UserApi.login(username, password)
                .then((response) => {
                    dispatch('common/setToken', response.data, {
                        root: true
                    }).then();
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    /**
     * 获取用户信息
     */
    getUserInfo({ commit }: { commit: Commit }): Promise<CustomResponse> {
        return new Promise<CustomResponse>((resolve, reject) => {
            UserApi.getUserInfo()
                .then((response) => {
                    const { userName, avatarUrl } = response.data.userInfo;

                    commit(SET_USERNAME, userName);
                    commit(SET_AVATAR, avatarUrl);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    /**
     * 退出登录
     */
    loginOut({
        commit,
        dispatch
    }: {
        commit: Commit;
        dispatch: Dispatch;
    }): Promise<CustomResponse> {
        dispatch('common/clearToken', {}, { root: true }).then();
        commit(RESET_USER_STATE);
        return new Promise<CustomResponse>((resolve, reject) => {
            UserApi.loginOut()
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    setUserAvatar({ commit }: { commit: Commit }, avatarUrl: string): void {
        commit(SET_AVATAR, avatarUrl);
    }
};

export default actions;
