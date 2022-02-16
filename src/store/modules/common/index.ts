import { Module } from 'vuex';
import * as states from './states';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { RootState } from '../../index.d';

export type CommonState = states.CommonState;

const common: Module<states.CommonState, RootState> = {
    namespaced: true,
    state: states.state,
    getters,
    mutations,
    actions
};

export default common;
