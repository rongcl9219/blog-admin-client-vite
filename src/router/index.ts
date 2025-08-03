import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import Routers from './modules/routes';
import { useUserStore } from '@/store/user';

const routes: Array<any> = Routers,
    router = createRouter({
        history: createWebHistory(),
        routes
    });

// 改变进度条的HTML结构
NProgress.configure({
    template: '<div class="bar" role="bar"><div class="peg"></div></div>'
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const token = userStore.token;

    NProgress.start();
    if (to.meta.requiresAuth) {
        if (token) {
            const userInfo = userStore.username;

            if (!userInfo) {
                userStore.getUserInfo().then().catch();
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
