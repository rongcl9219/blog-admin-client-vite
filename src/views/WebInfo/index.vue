<template>
    <div class="web-info" v-loading="globalLoading" :element-loading-text="loadingText">
        <el-card class="box-card" shadow="hover">
            <el-form ref="webInfoFormRef" :model="webInfoForm" label-width="100px" label-suffix=":">
                <el-form-item label="网站名称">
                    <el-input v-model="webInfoForm.webUser"></el-input>
                </el-form-item>
                <el-form-item label="座右铭">
                    <el-input v-model="webInfoForm.motto"></el-input>
                </el-form-item>
                <el-form-item label="github地址">
                    <el-input v-model="webInfoForm.githubLink"></el-input>
                </el-form-item>
                <el-form-item label="个人头像">
                    <div class="avatar-item web-avatar-box">
                        <template v-if="webInfoForm.avatar.url">
                            <img :src="webInfoForm.avatar.url" alt="" />
                        </template>
                    </div>
                    <el-button class="upload-avatar-btn" @click="uploadAvatarVisible = true">
                        <el-icon><Plus /></el-icon>
                    </el-button>
                </el-form-item>
                <el-form-item label="网站banner">
                    <div class="avatar-item web-banner-box">
                        <template v-if="webBannerUrl">
                            <img :src="webBannerUrl" alt="" />
                        </template>
                    </div>
                    <el-button class="upload-avatar-btn" @click="upLoadImgVisible = true">
                        <el-icon><Plus /></el-icon>
                    </el-button>
                </el-form-item>
                <el-form-item label="个人简介">
                    <el-input type="textarea" v-model="webInfoForm.personalDesc"></el-input>
                </el-form-item>
                <el-form-item label="网站简介">
                    <el-input type="textarea" v-model="webInfoForm.webDesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <UploadAvatar
            thumbnail="avatar"
            @crop-upload-success="uploadAvatarSuccess"
            @crop-upload-fail="uploadAvatarFail"
            v-model:upload-avatar-visible="uploadAvatarVisible"
        />

        <UploadImage
            v-model:imgList="webInfoForm.webBanner"
            v-model:uploadImgVisible="upLoadImgVisible"
            :imgWidth="100"
            :imgHeight="100"
            :limitNum="1"
        />
    </div>
</template>

<script lang="ts">
export default {
    name: 'WebInfo'
};
</script>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount, computed, nextTick } from 'vue';
import type { ElForm } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import UploadAvatar from '@/components/UploadAvatar/index.vue';
import UploadImage from '@/components/UploadImage/index.vue';
import { WebInfoApi } from '@/api';
import myMessage from '@/utils/myMessage';
import viewer from '@/utils/viewer';

interface Avatar {
    url: string;
    key: string;
}

interface WebBanner {
    [index: string]: any;
}

interface WebInfoForm {
    webUser: string;
    githubLink: string;
    avatar: Avatar;
    webBanner: Array<WebBanner>;
    motto: string;
    personalDesc: string;
    webDesc: string;
}

type FromInstanceType = InstanceType<typeof ElForm>;

const webInfoFormRef = ref<FromInstanceType>();

const upLoadImgVisible = ref(false);
const uploadAvatarVisible = ref(false);
const globalLoading = ref(false);

const webInfoForm = reactive<WebInfoForm>({
    webUser: '',
    githubLink: '',
    avatar: {
        url: '',
        key: ''
    },
    webBanner: [],
    motto: '',
    personalDesc: '',
    webDesc: ''
});

const loadingText = ref('加载中...');

const webBannerUrl = computed(() => {
    return webInfoForm.webBanner.length > 0 && webInfoForm.webBanner[0].url;
});

const uploadAvatarSuccess = (fileObj: any) => {
    myMessage({
        type: 'success',
        message: '上传成功'
    });
    webInfoForm.avatar.key = fileObj.key;
    webInfoForm.avatar.url = fileObj.url;
};

const uploadAvatarFail = (error: any) => {
    myMessage({
        type: 'error',
        message: error.msg || '上传失败'
    });
};

const onSubmit = () => {
    loadingText.value = '保存中...';
    globalLoading.value = true;

    const webBanner =
        webInfoForm.webBanner && webInfoForm.webBanner.length > 0 ?
            webInfoForm.webBanner[0].key :
            '';

    const paramObj = {
        WEB_USER: webInfoForm.webUser,
        GITHUB_LINK: webInfoForm.githubLink,
        WEB_AVATAR: webInfoForm.avatar.key,
        PERSONAL_DESC: webInfoForm.personalDesc,
        WEB_DESC: webInfoForm.webDesc,
        MOTTO: webInfoForm.motto,
        WEB_BANNER: webBanner
    };

    WebInfoApi.saveWebInfo({ paramObj })
        .then(() => {
            myMessage({
                type: 'success',
                message: '保存成功'
            });
        })
        .catch(() => {
            myMessage({
                type: 'error',
                message: '保存失败'
            });
        })
        .finally(() => {
            globalLoading.value = false;
        });
};

onBeforeMount(() => {
    globalLoading.value = true;
    WebInfoApi.getWebInfo()
        .then((res) => {
            const paramData = res.data.paramData;
            webInfoForm.webUser = paramData.WEB_USER || '';
            webInfoForm.githubLink = paramData.GITHUB_LINK || '';
            webInfoForm.personalDesc = paramData.PERSONAL_DESC || '';
            webInfoForm.webDesc = paramData.WEB_DESC || '';
            webInfoForm.motto = paramData.MOTTO || '';
            if (paramData.WEB_AVATAR) {
                webInfoForm.avatar = paramData.WEB_AVATAR;
            }
            if (paramData.WEB_BANNER) {
                webInfoForm.webBanner.push(paramData.WEB_BANNER);
            }
        })
        .catch()
        .finally(() => {
            globalLoading.value = false;
            nextTick(() => {
                viewer(document.querySelectorAll('.web-banner-box')[0] as HTMLElement);
                viewer(document.querySelectorAll('.web-avatar-box')[0] as HTMLElement);
            });
        });
});
</script>

<style scoped lang="scss">
.avatar-item {
    float: left;
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 3px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
}
.upload-avatar-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    line-height: 14px;
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    color: #000;
    font-size: 20px;
    transition: 0.3s;

    &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
    }
}
</style>
