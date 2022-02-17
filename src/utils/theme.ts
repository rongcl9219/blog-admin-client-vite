import { cacheThemeInfo } from '@/core/storageCache';
import NProgress from 'nprogress';

// 变量前缀
const primary = '--el-color-primary';
// 白色混合色
const mixWhite = '#ffffff';
// 黑色混合色
const mixBlack = '#000000';

const themeInfo = cacheThemeInfo.load() || null;

const mix = (color1: any, color2: any, weight: any) => {
    let r: string | number;
    let g: string | number;
    let b: string | number;

    const newWeight = Math.max(Math.min(Number(weight), 1), 0);

    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    r = Math.round(r1 * (1 - newWeight) + r2 * newWeight);
    g = Math.round(g1 * (1 - newWeight) + g2 * newWeight);
    b = Math.round(b1 * (1 - newWeight) + b2 * newWeight);

    r = ('0' + (r || 0).toString(16)).slice(-2);
    g = ('0' + (g || 0).toString(16)).slice(-2);
    b = ('0' + (b || 0).toString(16)).slice(-2);

    return '#' + r + g + b;
};

/**
 * 设置本地主题
 */
export const themeColor = themeInfo ? themeInfo.primaryColor : null;

/**
 * 加载本地主题
 */
export const initTheme = () => {
    const style = themeInfo && themeInfo.themeStyle;
    document.documentElement.style.cssText = style ? style : '';
};

/**
 * @description 设置主题
 * @param color
 */
export const setTheme = (color: string) => {
    NProgress.start();
    const node = document.documentElement;
    // 主色调
    node.style.setProperty(primary, color);

    // 这里是覆盖原有颜色的核心代码
    for (let i = 1; i < 10; i += 1) {
        node.style.setProperty(`${primary}-light-${i}`, mix(color, mixWhite, i * 0.1));
    }
    node.style.setProperty('--el-color-primary-dark', mix(color, mixBlack, 0.1));
    // 本地缓存style，样式持久化，你也可以存在后端
    cacheThemeInfo.save({
        primaryColor: color,
        themeStyle: node.style.cssText
    });
    NProgress.done();
};
