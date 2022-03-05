import CookieCache from '@/core/Cookie/cookie';
import KEYS from '@/core/storageCache/keys';

/**
 * 保存accessToken
 */
export const cacheAccessToken = new CookieCache(KEYS.accessToken, {
    expires: 0
});

/**
 * 保存refreshToken
 */
export const cacheRefreshToken = new CookieCache(KEYS.refreshToken, {
    expires: 1
});

/**
 * 保存tokenExp
 */
export const cacheTokenExp = new CookieCache(KEYS.tokenExp, {
    expires: 0
});
