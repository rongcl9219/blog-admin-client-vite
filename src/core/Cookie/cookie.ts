import Cookies from 'js-cookie';

interface IOptions {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
}

class CookieCache {
    protected key: string;
    protected cookie: any;
    protected options: IOptions = {
        expires: 0,
        path: '',
        domain: '',
        secure: false
    };

    constructor(key: string, options: IOptions) {
        this.key = key;
        this.options = Object.assign(this.options, options);
        this.cookie = (Cookies as any).noConflict();
    }

    /**
     * 保存
     * @param value
     */
    save(value: any) {
        this.cookie.set(this.key, value, this.options);
    }

    /**
     * 获取值
     */
    load() {
        return this.cookie.get(this.key);
    }

    /**
     * 删除
     */
    delete() {
        this.cookie.remove(this.key);
    }
}

export default CookieCache;
