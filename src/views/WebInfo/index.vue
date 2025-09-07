<template>
  <div class="web-info">
    <el-card
      class="box-card"
      shadow="hover"
    >
      <el-form
        ref="webInfoFormRef"
        :model="webInfoForm"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="网站名称">
          <el-input v-model="webInfoForm.webUser" />
        </el-form-item>
        <el-form-item label="座右铭">
          <el-input v-model="webInfoForm.motto" />
        </el-form-item>
        <el-form-item label="github地址">
          <el-input v-model="webInfoForm.githubLink" />
        </el-form-item>
        <el-form-item label="个人头像">
          <ViewerImg :images="webInfoForm.avatar">
            <template #default="{ images }">
              <div class="avatar-item">
                <img
                  :src="images.url"
                  alt=""
                >
              </div>
            </template>
          </ViewerImg>
          <el-button
            class="upload-avatar-btn"
            @click="uploadAvatarVisible = true"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
        </el-form-item>
        <el-form-item label="网站banner">
          <ViewerImg :images="webInfoForm.webBanner">
            <template #default="{ images }">
              <div class="avatar-item">
                <img
                  v-for="item in images"
                  :key="item.key"
                  :src="item.url"
                  alt=""
                >
              </div>
            </template>
          </ViewerImg>
          <el-button
            class="upload-avatar-btn"
            @click="upLoadImgVisible = true"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="webInfoForm.personalDesc"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="网站简介">
          <el-input
            v-model="webInfoForm.webDesc"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <UploadAvatar
      v-model:upload-avatar-visible="uploadAvatarVisible"
      thumbnail="avatar"
      @crop-upload-success="uploadAvatarSuccess"
      @crop-upload-fail="uploadAvatarFail"
    />

    <UploadImage
      v-model:img-list="webInfoForm.webBanner"
      v-model:upload-img-visible="upLoadImgVisible"
      :img-width="100"
      :img-height="100"
      :limit-num="1"
      thumbnail="zipImage"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'WebInfo'
}
</script>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { ElLoading } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import UploadAvatar from '@/components/UploadAvatar/index.vue'
import UploadImage from '@/components/UploadImage/index.vue'
import { WebInfoApi } from '@/api'
import myMessage from '@/utils/myMessage'
import ViewerImg from '@/components/ViewerImg/index.vue'

interface Avatar {
  url: string;
  key: string;
}

interface WebInfoForm {
  webUser: string;
  githubLink: string;
  avatar: Avatar;
  webBanner: Array<GIFileInfo>;
  motto: string;
  personalDesc: string;
  webDesc: string;
}

const upLoadImgVisible = ref(false)
const uploadAvatarVisible = ref(false)

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
})

const uploadAvatarSuccess = (fileObj: any) => {
  myMessage({
    type: 'success',
    message: '上传成功'
  })
  webInfoForm.avatar.key = fileObj.key
  webInfoForm.avatar.url = fileObj.url
}

const uploadAvatarFail = (error: any) => {
  myMessage({
    type: 'error',
    message: error.msg || '上传失败'
  })
}

const onSubmit = () => {
  const loadingInstance = ElLoading.service({ fullscreen: true, text: '保存中...' })

  const webBanner =
    webInfoForm.webBanner && webInfoForm.webBanner.length > 0 ?
      webInfoForm.webBanner[0].key :
      ''

  const paramObj = {
    WEB_USER: webInfoForm.webUser,
    GITHUB_LINK: webInfoForm.githubLink,
    WEB_AVATAR: webInfoForm.avatar.key,
    PERSONAL_DESC: webInfoForm.personalDesc,
    WEB_DESC: webInfoForm.webDesc,
    MOTTO: webInfoForm.motto,
    WEB_BANNER: webBanner
  }

  WebInfoApi.saveWebInfo({ paramObj })
    .then(() => {
      myMessage({
        type: 'success',
        message: '保存成功'
      })
    })
    .catch(() => {
      myMessage({
        type: 'error',
        message: '保存失败'
      })
    })
    .finally(() => {
      loadingInstance.close()
    })
}

onBeforeMount(() => {
  WebInfoApi.getWebInfo()
    .then((res) => {
      const paramData = res.data.paramData
      webInfoForm.webUser = paramData.WEB_USER || ''
      webInfoForm.githubLink = paramData.GITHUB_LINK || ''
      webInfoForm.personalDesc = paramData.PERSONAL_DESC || ''
      webInfoForm.webDesc = paramData.WEB_DESC || ''
      webInfoForm.motto = paramData.MOTTO || ''
      if (paramData.WEB_AVATAR) {
        webInfoForm.avatar = paramData.WEB_AVATAR
      }
      if (paramData.WEB_BANNER) {
        webInfoForm.webBanner.push(paramData.WEB_BANNER)
      }
    })
    .catch()
})
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
