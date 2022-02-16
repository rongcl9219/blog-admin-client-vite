/**
 * @description 组合全部路由
 */

// 后台路由
import AdminRouters from './admin';

const routes = [
    ...AdminRouters,
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login/index.vue')
    },
    {
        path: '/403',
        name: '403',
        component: () => import(/* webpackChunkName: "403" */ '@/views/403.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: '404',
        component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
    }
];

export default routes;
