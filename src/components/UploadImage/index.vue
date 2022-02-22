<template>
    <el-dialog
        title="图片上传"
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :append-to-body="true"
        width="640px"
    >
        <template #title>
            <span>上传图片</span>
            <el-button
                class="close-dialog-btn"
                type="text"
                :icon="Close"
                @click="closeUpLoadImg"
            ></el-button>
        </template>
        <template #default>
            <div
                class="list_item"
                :style="imgStyle"
                v-for="(item, index) in refData.fileList"
                :key="index"
            >
                <div class="list_content">
                    <img :style="imgStyle" :src="item.url" alt="" />
                    <div class="preview_box">
                        <el-button type="text" class="preview_img_icon">
                            <el-icon>
                                <View />
                            </el-icon>
                        </el-button>
                    </div>
                </div>
                <el-button type="danger" class="remove_img" circle @click.stop="deleteImage(index)">
                    <el-icon>
                        <Close />
                    </el-icon>
                </el-button>
            </div>
            <el-upload
                class="upload_box"
                ref="uploadImageRef"
                action="/api/file/uploadImage"
                :show-file-list="false"
                list-type="picture"
                name="file"
                :limit="limit"
                :multiple="limit > 1"
                :file-list="refData.fileList"
                :on-change="fileChange"
                :on-exceed="overRange"
                :auto-upload="false"
            >
                <template #default>
                    <div
                        v-show="!hideUpload"
                        class="el-upload el-upload--picture-card upload_btn"
                        :style="imgStyle"
                    >
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </div>
                </template>
            </el-upload>
        </template>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeUpLoadImg">取 消</el-button>
                <el-button type="primary" @click="submitUpload">上 传</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
export default {
    name: 'UploadImage'
};
</script>
<script lang="ts" setup>
import { ref, toRefs, defineEmits, watch, computed, reactive } from 'vue';
import { Md5 } from 'ts-md5/dist/md5';
import { CommonApi } from '@/api';
import { getUuid } from '@/utils/tools';
import type { ElUpload } from 'element-plus';
import { ElLoading } from 'element-plus';
import myMessage from '@/utils/myMessage';
import { Plus, Close, View } from '@element-plus/icons-vue';

interface IProps {
    uploadImgVisible: boolean;
    imgList: Array<any>;
    imgWidth?: number;
    imgHeight?: number;
    thumbnail?: string;
    limitNum?: number;
}

type UploadInstance = InstanceType<typeof ElUpload>;

const emits = defineEmits([
    'image-upload-success',
    'image-upload-fail',
    'update:uploadImgVisible',
    'update:imgList'
]);

const uploadImageRef = ref<UploadInstance>();

const props = withDefaults(defineProps<IProps>(), {
    uploadImgVisible: false,
    imgList: (): Array<any> => [],
    imgWidth: 200,
    imgHeight: 200,
    thumbnail: '',
    limitNum: 1
});

const { uploadImgVisible, imgWidth, imgHeight, limitNum, thumbnail } = toRefs(props);

const dialogVisible = ref(false);

watch(uploadImgVisible, (newVal) => {
    dialogVisible.value = newVal;
});

const onImgUploadSuccess = (fileObj: any): void => {
    emits('image-upload-success', fileObj);
};

const onImgUploadFail = (error: any): void => {
    emits('image-upload-fail', error);
};

const onUploadImgVisibleChanged = (visible: boolean): void => {
    emits('update:uploadImgVisible', visible);
};

const onUploadImgListChanged = (files: Array<any>): void => {
    emits('update:imgList', files);
};

const imgStyle = computed(() => {
    let width = imgWidth.value;
    width = width < 50 ? 50 : width > 240 ? 240 : width;
    let height = imgHeight.value;
    height = height < 50 ? 50 : height > 240 ? 240 : height;
    return {
        width: `${width}px`,
        height: `${height}px`
    };
});

const limit = computed(() => {
    return limitNum.value < 1 ? 1 : limitNum.value;
});

const hideUpload = computed(() => {
    return refData.fileList.length === limit.value;
});

const refData = reactive<{
    isUpload: boolean;
    fileList: Array<any>;
}>({
    isUpload: false,
    fileList: []
});

/**
 * 判断文件是否是图片
 * @param ext 文件后缀
 */
const isAssetTypeAnImage = (ext: string) => {
    // const imageExtArr = ["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "svg", "tiff"];
    return ['png', 'jpg', 'jpeg'].indexOf(ext.toLowerCase()) !== -1;
};

/**
 * 上传
 */
const submitUpload = () => {
    if (refData.isUpload) {
        return false;
    }
    refData.isUpload = true;
    const uploadLoading = ElLoading.service({
        lock: true,
        text: '上传中...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    initImageData()
        .then((fileData: any) => {
            return CommonApi.getUploadToken({
                keys: fileData.keysStr,
                thumbnail: thumbnail.value
            }).then((res) => {
                let files = res.data;
                let uploadArr: Array<any> = [];
                files.map((file: any) => {
                    let formData = fileData.fileObj[file.key];
                    formData.append('token', file.token);
                    uploadArr.push(CommonApi.uploadImg(formData));
                    delete file.token;
                });
                return Promise.allSettled(uploadArr).then((data: any) => {
                    onUploadImgListChanged(files);
                    onImgUploadSuccess({ files, data });
                    closeUpLoadImg();
                });
            });
        })
        .catch((error) => {
            onImgUploadFail(error);
            myMessage({
                type: 'error',
                message: '上传失败'
            });
        })
        .finally(() => {
            refData.isUpload = false;
            uploadLoading.close();
        });
};

const initImageData = () => {
    return new Promise((resolve) => {
        let fileObj: any = {};
        let keys: string[] = [];
        refData.fileList.map((file) => {
            //  用FormData存放上传文件
            let formData = new FormData();
            let key = Md5.hashStr(getUuid());
            formData.append('file', file.raw, key);
            formData.append('key', key);
            keys.push(key);
            fileObj[key] = formData;
        });
        let keysStr = keys.join(',');
        resolve({ fileObj, keysStr });
    });
};

const closeUpLoadImg = () => {
    refData.fileList = [];
    // 清除选择列表
    if (uploadImageRef.value) {
        uploadImageRef.value?.clearFiles();
    }
    onUploadImgVisibleChanged(false);
};

const fileChange = (file: any, fileList: Array<any>) => {
    // 获取最后一个.的位置
    let index = file.name.lastIndexOf('.');
    // 获取后缀
    let ext = file.name.substring(index + 1);
    // 判断文件类型是否符合
    if (!isAssetTypeAnImage(ext)) {
        myMessage({
            type: 'error',
            message: '只能上传jpg/jpeg/png文件!'
        });
        // 必须手动移除，不然已选择的文件还存在list中
        fileList.splice(-1, 1);
        return false;
    }

    // 判断文件大小是否符合
    if (!(file.size / 1024 / 1024 <= 5)) {
        myMessage({
            type: 'error',
            message: '上传文件大小不能超过5MB!'
        });
        // 必须手动移除，不然已选择的文件还存在list中
        fileList.splice(-1, 1);
        return false;
    }
    refData.fileList = fileList;
};

const overRange = () => {
    myMessage({
        type: 'warning',
        message: `最多上传 ${limit.value} 张图片`
    });
};

const deleteImage = (index: number) => {
    refData.fileList.splice(index, 1);
};
</script>

<style scoped lang="scss">
.upload_box {
    display: inline-block;
}

.upload_btn {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-icon {
        margin: 0;
    }
}

.list_item {
    position: relative;
    display: inline-block;
    margin: 0 5px 5px 0;
    vertical-align: bottom;
    cursor: pointer;

    .list_content {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
    }

    .preview_box {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        width: 100%;
        height: 100%;
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.4);
        transition: 0.2s;

        .preview_img_icon {
            padding: 0;
            color: #fff;
        }

        .preview_img {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
        }
    }

    .remove_img {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        height: 16px;
        padding: 0;
        transform: translateX(30%) translateY(-30%);
    }
}

.list_item:hover {
    .preview_box {
        opacity: 1;
    }

    .remove_img {
        display: block;
    }
}
</style>
