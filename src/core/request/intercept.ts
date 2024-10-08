/**
 * @description 拦截器
 */

import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import { useUserStore } from '@/store/user';
import myMessage from '@/utils/myMessage';

// axios实例
const instance = axios.create({
    timeout: 5000
});
// 是否正在刷新token
let isRefreshing: boolean = false;
// 请求列表
let requestList: Array<any> = [];

instance.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
        const userStore = useUserStore();
        const timestamp = new Date().getTime();
        // 添加时间戳

        request.params = {
            _: timestamp,
            ...request.params
        };

        // 添加请求头token
        const { token, tokenExp, refreshToken } = userStore;

        if (/^(\/admin)/.test(request.url || '')) {
            if (token && tokenExp) {
                const dateNow = new Date().getTime();

                // token过期
                if (dateNow >= tokenExp) {
                    if (!isRefreshing) {
                        isRefreshing = true;

                        userStore
                            .refreshToken()
                            .then(() => {
                                isRefreshing = false;
                                requestList.forEach((cb) => cb());
                                requestList = [];
                            })
                            .catch(() => {
                                requestList = [];
                                isRefreshing = false;
                                router.replace({ path: '/403' }).then();
                            });
                    }

                    // 正在刷新token，返回一个未执行resolve的promise
                    return new Promise((resolve) => {
                        // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                        requestList.push(() => {
                            resolve(request);
                        });
                    });
                }
            }
            return request;
        }

        if (request.url && request.url === '/refreshToken') {
            request.headers.set('authorization', `Bearer ${refreshToken}`);
        }

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const data = response.data;

        if (!data.status) {
            if (data.code === -4001) {
                router
                    .replace({
                        path: '/403'
                    })
                    .then();
            }
            return Promise.reject(response.data);
        }
        return response;
    },
    (error) => {
        myMessage({
            type: 'error',
            message: '请求失败'
        });
        return Promise.reject(error);
    }
);

export default instance;
