<template>
    <div class="login-container">
        <div class="login-card">
            <h3 class="title">后台登录</h3>
            <el-form
                ref="loginFormRef"
                class="login-form"
                :model="loginForm"
                :rules="loginFormRules"
                label-position="left"
            >
                <el-form-item prop="username">
                    <span class="login-icon">
                        <svg-icon icon-class="user" />
                    </span>
                    <el-input v-model="loginForm.username" placeholder="用户名" type="text" />
                </el-form-item>
                <el-form-item prop="password">
                    <span class="login-icon">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input
                        v-model="loginForm.password"
                        :type="passwordType ? 'password' : 'text'"
                        placeholder="密码"
                    />
                    <span class="show-pwd" @click="passwordType = !passwordType">
                        <svg-icon icon-class="eyes-close" v-if="passwordType" />
                        <svg-icon icon-class="eyes" v-else />
                    </span>
                </el-form-item>
                <el-form-item prop="validCode">
                    <div style="display: flex; align-items: center; width: 100%">
                        <span class="login-icon" style="margin-right: 5px">
                            <svg-icon icon-class="verification-code" />
                        </span>
                        <el-input
                            v-model="loginForm.validCode"
                            type="text"
                            autocomplete="off"
                            placeholder="验证码，不区分大小写"
                        ></el-input>
                        <ValidCode
                            v-model:valid-code="validCodeModel.validCode"
                            :refresh="validCodeModel.codeRefresh"
                        ></ValidCode>
                    </div>
                </el-form-item>
                <el-button
                    :loading="loading"
                    type="primary"
                    style="width: 100%; margin-bottom: 30px"
                    @click="handleLogin(loginFormRef, $event)"
                >
                    登录
                </el-button>
                <el-button type="primary" @click="initAdmin" style="width: 100%; margin: 0">
                    初始化管理员
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onBeforeMount, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import type { ElForm } from 'element-plus';
import { UserApi } from '@/api';
import myMessage from '@/utils/myMessage';
import ValidCode from '@/components/ValidCode/index.vue';

type FormInstance = InstanceType<typeof ElForm>;

interface LoginForm {
    username: string;
    password: string;
    validCode: string;
}

interface ValidCodeModel {
    validCode: string;
    codeRefresh: number;
}

const router = useRouter();
const store = useStore();

const loginFormRef = ref<FormInstance>();
const loginForm = reactive<LoginForm>({
    username: '',
    password: '',
    validCode: ''
});

const validCodeModel = reactive<ValidCodeModel>({
    validCode: '',
    codeRefresh: 0
});

const checkValidCode: RuleValidator = (rule: any, value: any, callback: RuleValidatorCallback): RuleValidatorCallback => {
    if (!value || value.trim() === '') {
        return callback(new Error('请输入验证码'));
    } else if (value.toLocaleUpperCase() !== validCodeModel.validCode.toLocaleUpperCase()) {
        ++validCodeModel.codeRefresh;
        return callback(new Error('验证码错误'));
    }
    return callback();
};

const loginFormRules = reactive<FormRule>({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    validCode: [
        {
            required: true,
            validator: checkValidCode,
            trigger: 'blur'
        }
    ]
});

let passwordType = ref(true);
let loading = ref(false);
let loginLock = false;

/**
 * 登录
 */
const handleLogin = (formEl: FormInstance | undefined, event?: PointerEvent) => {
    if (!formEl) {
        return false;
    }

    if (loginLock) {
        return false;
    }

    loginLock = true;
    loading.value = true;

    if (event) {
        // 去除按钮聚焦，否则先点击按钮在按回车会重复触发事件
        let target = event.target as HTMLElement;
        if (target.nodeName === 'SPAN' || target.nodeName === 'I') {
            target = target.parentElement as HTMLElement;
        }
        target.blur();
    }

    formEl.validate((valid) => {
        if (valid) {
            store
                .dispatch('user/login', loginForm)
                .then(() => {
                    router.push('/');
                })
                .catch((error) => {
                    myMessage({
                        type: 'error',
                        message: error.msg
                    });
                    validCodeModel.codeRefresh++;
                    loading.value = false;
                    loginLock = false;
                });
        } else {
            loading.value = false;
            loginLock = false;
        }
    });
};

/**
 * 初始化管理员
 */
const initAdmin = () => {
    UserApi.initSysAdmin()
        .then((res) => {
            myMessage({
                type: 'success',
                message: `初始化成功！用户名为：${res.data.username}，密码为：${res.data.password}`
            });
        })
        .catch((error) => {
            myMessage({
                type: 'error',
                message: error.msg || '初始化失败'
            });
        });
};

/**
 * 回车
 */
const handleKeyup = (e: KeyboardEvent) => {
    // 将target装换为对应的HTML元素
    const target = e.target as HTMLElement;
    if (e.keyCode === 13 && target.baseURI.match(/login/)) {
        handleLogin(loginFormRef.value); // 调用登录 验证方法
    }
};

onBeforeMount(() => {
    store.dispatch('user/loginOut');
    document.addEventListener('keyup', handleKeyup);
});

onUnmounted(() => {
    document.removeEventListener('keyup', handleKeyup);
});
</script>

<style lang="scss">
$cursor: #222;
$input_bg: #bcd4e1;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            height: 47px;
            padding: 12px 5px 12px 15px;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: #222;
            -webkit-appearance: none;
            caret-color: $cursor;
            box-shadow: 0 0 0 1000px #bcd4e1 inset!important;
            &:-webkit-autofill {
                -webkit-text-fill-color: #283443 !important;
            }
            &::-webkit-input-placeholder {
                color: gray;
            }
            &::-moz-placeholder {
                color: gray;
            }
            &::-ms-input-placeholder {
                color: gray;
            }
        }
        .el-input__wrapper {
            padding: 0;
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: $input_bg;
        border-radius: 5px;
        color: #454545;
    }
}
</style>
<style scoped lang="scss">
.login-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    user-select: none;
    overflow: hidden;
    &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(@/assets/images/default_img/login_bg.jpg);
        background-origin: revert;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        z-index: -1;
    }
    .login-card {
        position: relative;
        width: 600px;
        height: 500px;
        padding: 0 20px;
        box-sizing: border-box;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.25);
        .title {
            margin: 20px 0;
            font-size: 26px;
            letter-spacing: 10px;
            text-align: center;
            font-family: "zcool-kuaile", "sans-serif";
        }
        .login-icon {
            margin-left: 20px;
            font-size: 16px;
        }
        .show-pwd {
            font-size: 16px;
            cursor: pointer;
        }
    }
}
</style>
