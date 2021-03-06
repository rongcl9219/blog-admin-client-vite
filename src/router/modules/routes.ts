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
        component: () => import('@/views/Login/LoginPage.vue')
    },
    {
        path: '/403',
        name: 'RefuseError',
        component: () => import('@/views/RefuseError.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    }
];

export default routes;
