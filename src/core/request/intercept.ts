/**
 * @description 拦截器
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';
import store from '@/store';
import Message from '@/utils/resetMessage';

// axios实例
const instance = axios.create({
    timeout: 5000
});
// 是否正在刷新token
let isRefreshing: boolean = false;
// 请求列表
let requestList: Array<any> = [];

instance.interceptors.request.use(
    (request: AxiosRequestConfig) => {
        const timestamp = new Date().getTime();
        // 添加时间戳

        request.params = {
            _: timestamp,
            ...request.params
        };

        // 添加请求头token
        const { token, refreshToken, tokenExp } = store.state.common;

        if (/^(\/admin)/.test(request.url || '')) {
            if (token && tokenExp) {
                request.headers = {
                    authorization: `Bearer ${token}`
                };
                const dateNow = new Date().getTime();

                // token过期
                if (dateNow >= tokenExp) {
                    if (!isRefreshing) {
                        isRefreshing = true;

                        store
                            .dispatch('common/refreshToken')
                            .then((res) => {
                                const { accessToken } = res.data;

                                isRefreshing = false;
                                request.headers = {
                                    authorization: `Bearer ${accessToken}`
                                };
                                requestList.forEach((cb) => cb(accessToken));
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
                        requestList.push((accessToken: string) => {
                            request.headers = {
                                authorization: `Bearer ${accessToken}`
                            };
                            resolve(request);
                        });
                    });
                }
            }
            return request;
        }

        if (request.url && request.url === '/refreshToken') {
            request.headers = {
                authorization: `Bearer ${token} ${refreshToken}`
            };
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
            if (data.code === -40001) {
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
        Message({
            type: 'error',
            message: '请求失败'
        });
        return Promise.reject(error);
    }
);

export default instance;
