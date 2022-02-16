import { Module } from 'vuex';
import * as states from './states';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { RootState } from '../../index.d';

export type UserState = states.UserState;

const user: Module<states.UserState, RootState> = {
    namespaced: true,
    state: states.state,
    getters,
    mutations,
    actions
};

export default user;
