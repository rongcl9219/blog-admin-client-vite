<template>
    <MarkdownEditor
        :model-value="mdText"
        :on-change="onChange"
        :toolbars="toolbars"
        :on-save="onContentSave"
        :previewOnly="previewOnly"
        :on-upload-img="onUploadImg"
    />
</template>

<script lang="ts">
export default {
    name: 'MdEditor'
};
</script>
<script lang="ts" setup>
import { toRefs, onMounted, computed, nextTick } from 'vue';
import MarkdownEditor, { ToolbarNames } from 'md-editor-v3';
import { toolbarArr } from './config';
import { Md5 } from 'ts-md5';
import { getUuid } from '@/utils/tools';
import Viewer from '@/utils/viewer';
import { CommonApi } from '@/api';
import { ElLoading } from 'element-plus';
import myMessage from '@/utils/myMessage';
import 'md-editor-v3/lib/style.css';

interface IProps {
    content: string;
    previewOnly?: boolean;
}

const emits = defineEmits(['update:content', 'on-save']);

const props = withDefaults(defineProps<IProps>(), {
    content: '',
    previewOnly: false
});

const { content, previewOnly } = toRefs(props);

const onContentChange = (value: string) => {
    emits('update:content', value);
};

const onContentSave = (value: string) => {
    emits('on-save', value);
};

const toolbars = computed(() => {
    return toolbarArr as ToolbarNames[];
});

const mdText = computed(() => {
    return content.value;
});

const onChange = (value: string) => {
    onContentChange(value);
};

const onUploadImg = (files: FileList, callback: (urls: string[]) => void) => {
    const uploadLoading = ElLoading.service({
        lock: true,
        text: '上传中...',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    initImageData(files)
        .then((fileData: any) => {
            const { keysStr, fileObj } = fileData;
            return CommonApi.getUploadToken({
                keys: keysStr,
                thumbnail: 'zipImage'
            }).then((res) => {
                let files = res.data;
                let uploadArr: Array<any> = [];
                files.map((file: any) => {
                    fileObj[file.key].url = file.url;
                    let formData = fileObj[file.key];
                    formData.append('token', file.token);
                    uploadArr.push(CommonApi.uploadImg(formData));
                });
                return Promise.allSettled(uploadArr).then((data: Array<any>) => {
                    callback(
                        data.map((item) => {
                            return item.value.status && fileObj[item.value.key].url;
                        })
                    );
                });
            });
        })
        .catch(() => {
            myMessage({
                type: 'error',
                success: '上传失败'
            });
        })
        .finally(() => {
            uploadLoading.close();
        });
};

const initImageData = (files: FileList) => {
    return new Promise((resolve) => {
        let fileObj: any = {};
        let keys: string[] = [];
        Array.from(files).map((file) => {
            //  用FormData存放上传文件
            let formData = new FormData();
            let key = Md5.hashStr(getUuid());
            formData.append('file', file, key);
            formData.append('key', key);
            keys.push(key);
            fileObj[key] = formData;
        });
        let keysStr = keys.join(',');
        resolve({ fileObj, keysStr });
    });
};

onMounted(() => {
    nextTick(() => {
        if (previewOnly.value) {
            Viewer(document.querySelector('#md-preview') as HTMLElement);
        }
    });
});
</script>

<style lang="scss">
.md-preview-wrapper {
    img {
        cursor: zoom-in;
    }

    figure {
        display: block;
    }
}
</style>
