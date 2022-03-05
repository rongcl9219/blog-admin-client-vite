import { cacheAccessToken } from '@/core/cookieCache';
import { cacheRefreshToken, cacheTokenExp } from '@/core/storageCache';

export interface CommonState {
    token?: any;
    refreshToken?: any;
    tokenExp?: any;
    asideWebInfo?: any;
}

export const state: CommonState = {
    token: cacheAccessToken.load() || null,
    refreshToken: cacheRefreshToken.load() || null,
    tokenExp: cacheTokenExp.load() || null,
    asideWebInfo: {}
};
