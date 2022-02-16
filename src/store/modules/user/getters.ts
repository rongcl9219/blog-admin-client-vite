import { GetterTree } from 'vuex';
import { UserState } from './states';
import { RootState } from '../../index.d';

const getters: GetterTree<UserState, RootState> = {
    getUsername: (state) => {
        return state.username;
    },
    getAvatar: (state) => {
        return state.avatar;
    }
};

export default getters;
