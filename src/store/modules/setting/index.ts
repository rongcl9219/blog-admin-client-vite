import { Module } from 'vuex';
import * as states from './states';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { RootState } from '../../index.d';

export type SettingState = states.SettingState;

const setting: Module<states.SettingState, RootState> = {
    namespaced: true,
    state: states.state,
    getters,
    mutations,
    actions
};

export default setting;
