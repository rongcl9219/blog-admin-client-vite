import { createStore } from 'vuex';
import common, { CommonState } from './modules/common';
import setting, { SettingState } from './modules/setting';
import user, { UserState } from './modules/user';

interface ModuleTypes {
    common: CommonState;
    setting: SettingState;
    user: UserState;
}

export default createStore<ModuleTypes>({
    modules: {
        common,
        setting,
        user
    }
});
