<template>
    <el-dialog
        title="修改密码"
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :show-close="false"
        :close-on-click-modal="false"
    >
        <template #title>
            <span>修改密码</span>
            <el-button
                class="close-dialog-btn"
                type="text"
                :icon="Close"
                @click="closeUpdatePassword(updatePasswordFormRef)"
            ></el-button>
        </template>
        <el-form
            ref="updatePasswordFormRef"
            :model="updatePasswordForm"
            status-icon
            :rules="formRules"
            :label-width="150"
        >
            <el-form-item label="输入旧密码" prop="oldPass">
                <el-input
                    v-model="updatePasswordForm.oldPass"
                    placeholder="请输入旧密码"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="输入新密码" prop="newPass">
                <el-input
                    placeholder="密码必须包含且只能由数字和字母组成，长度8~16"
                    v-model="updatePasswordForm.newPass"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="checkPass">
                <el-input
                    v-model="updatePasswordForm.checkPass"
                    placeholder="请再次输入密码"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeUpdatePassword(updatePasswordFormRef)">取 消</el-button>
                <el-button type="primary" @click="updatePass">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
export default {
    name: 'UpdatePassword'
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, toRefs, defineEmits } from 'vue';
import type { ElForm } from 'element-plus';
import { useRouter } from 'vue-router';
import { UserApi } from '@/api';
import myMessage from '@/utils/myMessage';
import { Close } from '@element-plus/icons-vue';

interface PasswordForm {
    oldPass: string;
    newPass: string;
    checkPass: string;
}

type FormInstance = InstanceType<typeof ElForm>;

const updatePasswordFormRef = ref<FormInstance>();

const router = useRouter();

const emits = defineEmits(['update:updatePasswordVisible']);

const props = defineProps({
    updatePasswordVisible: {
        type: Boolean,
        required: true,
        default: false
    }
});

const { updatePasswordVisible } = toRefs(props);

const dialogVisible = ref(false);

watch(updatePasswordVisible, (newVal) => {
    dialogVisible.value = newVal;
});

const updatePasswordForm = reactive<PasswordForm>({
    oldPass: '',
    newPass: '',
    checkPass: ''
});

const validatePassword: RuleValidator = (
    rule: any,
    value: any,
    callback: RuleValidatorCallback
): RuleValidatorCallback => {
    if (value.trim() === '') {
        return callback(new Error('请输入新密码'));
    } else if (!/^(?![^a-zA-Z]+$)(?!\\D+$).{8,16}$/.test(value)) {
        return callback(new Error('密码必须包含且只能由数字和字母组成，长度8~16'));
    } else if (value !== updatePasswordForm.checkPass) {
        updatePasswordForm.checkPass = '';
        return callback(new Error('两次密码输入不一致'));
    }
    return callback();
};

const checkPassword: RuleValidator = (
    rule: any,
    value: any,
    callback: RuleValidatorCallback
): RuleValidatorCallback => {
    if (value.trim() === '') {
        return callback(new Error('请再次输入密码'));
    } else if (value !== updatePasswordForm.newPass) {
        updatePasswordForm.checkPass = '';
        return callback(new Error('两次密码输入不一致'));
    } else if (updatePasswordFormRef.value) {
        updatePasswordFormRef.value?.validateField('newPass', () => {});
    }
    return callback();
};

const formRules = reactive<FormRule>({
    oldPass: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPass: [
        {
            validator: validatePassword,
            required: true,
            trigger: 'blur'
        }
    ],
    checkPass: [
        {
            validator: checkPassword,
            required: true,
            trigger: 'blur'
        }
    ]
});

const closeUpdatePassword = (formEl: FormInstance | undefined): void => {
    emits('update:updatePasswordVisible', false);
    if (formEl) {
        formEl.resetFields();
    }
};

const updatePass = (formEl: FormInstance | undefined) => {
    if (!formEl) {
        return false;
    }

    formEl.validate((valid) => {
        if (valid) {
            UserApi.updatePassword(updatePasswordForm).then(() => {
                myMessage({
                    type: 'success',
                    message: '修改成功'
                });
                router.replace('/login');
            });
        } else {
            myMessage({
                type: 'error',
                message: '修改失败'
            });
        }
    });
};
</script>

<style scoped></style>
