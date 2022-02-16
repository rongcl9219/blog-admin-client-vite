import { MutationTree } from 'vuex';
import { UserState, getDefaultState } from './states';
import { SET_AVATAR, SET_USERNAME, RESET_USER_STATE } from './types';

const mutations: MutationTree<UserState> = {
    [RESET_USER_STATE]: (state) => {
        Object.assign(state, getDefaultState());
    },
    [SET_USERNAME]: (state, username: string) => {
        state.username = username;
    },
    [SET_AVATAR]: (state, avatar: string) => {
        state.avatar = avatar;
    }
};

export default mutations;
