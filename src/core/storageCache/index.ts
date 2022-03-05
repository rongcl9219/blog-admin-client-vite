import StorageCache from './storage';
import KEYS from './keys';

/**
 * 保存主题信息
 */
export const cacheThemeInfo = new StorageCache(KEYS.theme);
