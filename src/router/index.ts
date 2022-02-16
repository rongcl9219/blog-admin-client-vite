import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import Routers from './modules/routes';
import store from '@/store';

const routes: Array<RouteRecordRaw> = Routers,
    router = createRouter({
        history: createWebHistory(),
        routes
    });

// 改变进度条的HTML结构
NProgress.configure({
    'template': '<div class="bar" role="bar"><div class="peg"></div></div>'
});

router.beforeEach((to, from, next) => {
    const token = store.state.common.token;

    NProgress.start();
    if (to.meta.requiresAuth) {
        if (token) {
            const userInfo = store.state.user.username;

            if (!userInfo) {
                store.dispatch('user/getUserInfo').then().catch();
            }
            return next();
        }
        return next({
            path: '/login',
            replace: true
        });

    }
    return next();

});

router.afterEach(() => {
    NProgress.done();
});

export default router;
