const KEYS: GIObject = {
    refreshToken: 'rk',
    tokenExp: 'exp',
    theme: 'adminTheme'
},
    NameSpace = 'MY_BLOG';

for (const key in KEYS) {
    if (Object.prototype.hasOwnProperty.call(KEYS, key)) {
        KEYS[key] = `${NameSpace}:${key}`.toUpperCase();
    }
}

export default KEYS;
