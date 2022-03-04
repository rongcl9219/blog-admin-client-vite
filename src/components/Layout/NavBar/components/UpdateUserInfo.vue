<template>
    <el-dialog
        title="个人信息"
        @open="openUserInfoDialog"
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :append-to-body="true"
        :show-close="false"
        :close-on-click-modal="false"
    >
        <template #title>
            <span>修改密码</span>
            <el-button
                class="close-dialog-btn"
                type="text"
                :icon="Close"
                @click="closeUserInfoDialog"
            ></el-button>
        </template>
        <el-form ref="userInfoFormRef" :model="userInfoForm" status-icon label-width="80px">
            <el-form-item label="头像">
                <el-avatar style="float: left; margin-right: 10px" shape="square" :size="50">
                    <img :src="userInfoForm.avatarUrl" alt="" />
                </el-avatar>
                <el-button type="primary" @click="uploadAvatarVisible = true">上传头像</el-button>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="userInfoForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="个性签名">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    v-model="userInfoForm.signature"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button @click="closeUserInfoDialog">取 消</el-button>
                <el-button type="primary" @click="updateUserInfo()">确 定</el-button>
            </div>
        </template>
    </el-dialog>

    <UploadAvatar
        thumbnail="avatar"
        @crop-upload-success="uploadAvatarSuccess"
        @crop-upload-fail="uploadAvatarFail"
        v-model:upload-avatar-visible="uploadAvatarVisible"
    />
</template>

<script lang="ts">
export default {
    name: 'UpdateUserInfo'
};
</script>
<script lang="ts" setup>
import { ref, reactive, toRefs, watch } from 'vue';
import { useStore } from 'vuex';
import type { ElForm } from 'element-plus';
import { UserApi } from '@/api';
import myMessage from '@/utils/myMessage';
import { ElLoading } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import UploadAvatar from '@/components/UploadAvatar/index.vue';

interface IUserInfoForm {
    avatar: string;
    signature: string;
    email: string;
    avatarUrl: string;
    userId: string;
}

type FormInstance = InstanceType<typeof ElForm>;

const userInfoFormRef = ref<FormInstance>();
const emits = defineEmits(['update:userInfoVisible']);
const store = useStore();

const props = defineProps({
    userInfoVisible: {
        type: Boolean,
        required: true,
        default: false
    }
});
const { userInfoVisible } = toRefs(props);
const dialogVisible = ref(false);

watch(userInfoVisible, (newVal) => {
    dialogVisible.value = newVal;
});

const uploadAvatarVisible = ref(false);

const userInfoForm = reactive<IUserInfoForm>({
    avatar: '',
    signature: '',
    email: '',
    avatarUrl: '',
    userId: ''
});

const openUserInfoDialog = () => {
    UserApi.getUserInfo()
        .then(res => {
            Object.assign(userInfoForm, res.data.userInfo);
        })
        .catch(err => {
            myMessage({
                type: 'error',
                message: err.msg || '获取信息失败'
            });
        });
};

const closeUserInfoDialog = () => {
    emits('update:userInfoVisible', false);
    userInfoFormRef.value?.resetFields();
};

const updateUserInfo = () => {
    const updateLoading = ElLoading.service({
        lock: true,
        text: '保存中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    let data = {
        avatar: userInfoForm.avatar,
        signature: userInfoForm.signature,
        email: userInfoForm.email,
        userId: userInfoForm.userId
    };

    UserApi.updateUserInfo(data)
        .then(() => {
            myMessage({
                type: 'success',
                message: '修改成功'
            });
            store.dispatch('user/setUserAvatar', userInfoForm.avatarUrl);
            closeUserInfoDialog();
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: '修改失败'
            });
        })
        .finally(() => {
            updateLoading.close();
        });
};

const uploadAvatarSuccess = (fileObj: any) => {
    myMessage({
        type: 'success',
        message: '上传成功'
    });
    userInfoForm.avatar = fileObj.key;
    userInfoForm.avatarUrl = fileObj.url;
};

const uploadAvatarFail = (error: any) => {
    myMessage({
        type: 'error',
        message: error.msg || '上传失败'
    });
};
</script>

<style scoped></style>
