<template>
    <el-dialog
        title="上传头像"
        width="600px"
        v-model="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :append-to-body="true"
        :show-close="false"
    >
        <template #title>
            <span>上传头像</span>
            <el-button
                class="close-dialog-btn"
                type="text"
                :icon="Close"
                @click="closeUpLoadImg"
            ></el-button>
        </template>
        <template #default>
            <div class="img-copper-wrapper">
                <el-row type="flex">
                    <el-col :span="17">
                        <div class="img-copper-left">
                            <div class="img-copper-con">
                                <img
                                    class="img-copper-img"
                                    draggable="false"
                                    :src="String(sourceImg.imgUrl)"
                                    :style="sourceImgStyle"
                                    @drag="preventDefault"
                                    @dragstart="preventDefault"
                                    @dragend="preventDefault"
                                    @dragleave="preventDefault"
                                    @dragover="preventDefault"
                                    @dragenter="preventDefault"
                                    @drop="preventDefault"
                                    @mousedown="imgStartMove"
                                    @mousemove="imgMove"
                                    @mouseup="createImg"
                                    @mouseout="createImg"
                                    alt=""
                                />
                                <div
                                    :style="sourceImgShadeStyle"
                                    class="img-copper-img-shade img-copper-img-shade-1"
                                />
                                <div
                                    :style="sourceImgShadeStyle"
                                    class="img-copper-img-shade img-copper-img-shade-2"
                                />
                            </div>
                            <div class="img-copper-range" v-show="rangeShow">
                                <input
                                    class="img-copper-scale-input"
                                    :value="scale.range"
                                    type="range"
                                    step="1"
                                    min="0"
                                    max="100"
                                    @input="zoomChange"
                                />
                                <i
                                    class="img-copper-scale-down"
                                    @mousedown="startZoomSub"
                                    @mouseout="endZoomSub"
                                    @mouseup="endZoomSub"
                                />
                                <i
                                    class="img-copper-scale-plus"
                                    @mousedown="startZoomAdd"
                                    @mouseout="endZoomAdd"
                                    @mouseup="endZoomAdd"
                                />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="img-copper-right">
                            <div class="size-one">
                                <el-avatar shape="square" :size="100">
                                    <img :src="sourceImg.createImgUrl" alt="" />
                                </el-avatar>
                                <span>方形预览</span>
                            </div>
                            <div class="size-two">
                                <el-avatar :size="100">
                                    <img :src="sourceImg.createImgUrl" alt="" />
                                </el-avatar>
                                <span>圆形预览</span>
                            </div>
                            <div class="upload-avatar">
                                <input
                                    v-show="false"
                                    ref="fileInputRef"
                                    type="file"
                                    @change="fileChange"
                                />
                                <el-button size="small" type="primary" @click.prevent="handleClick"
                                    >选择
                                </el-button>
                                <el-button
                                    style="margin-left: 5px"
                                    size="small"
                                    type="success"
                                    @click.prevent="submitUpload"
                                >
                                    确定
                                </el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <canvas v-show="false" ref="canvasRef" :width="width" :height="height" />
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts">
export default {
    name: 'UploadAvatar'
};
</script>
<script lang="ts" setup>
import { ref, reactive, toRefs, computed, watch, nextTick } from 'vue';
import { CommonApi } from '@/api';
import myMessage from '@/utils/myMessage';
import { Md5 } from 'ts-md5/dist/md5';
import { ElLoading } from 'element-plus';
import { Close } from '@element-plus/icons-vue';

interface IProps {
    uploadAvatarVisible: boolean;
    width?: number;
    height?: number;
    thumbnail: string;
}

interface Scale {
    zoomAddOn: boolean; // 按钮缩放事件开启
    zoomSubOn: boolean; // 按钮缩放事件开启
    range: number; // 最大100
    rotateLeft: boolean; // 按钮向左旋转事件开启
    rotateRight: boolean; // 按钮向右旋转事件开启
    x: number;
    y: number;
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    minWidth: number; // 最宽
    minHeight: number;
    naturalWidth: number; // 原宽
    naturalHeight: number;
    sourceImgMouseDown?: any;
}

interface SourceImgMouseDown {
    on: boolean;
    mX: number; // 鼠标按下的坐标
    mY: number;
    x: number; // scale原图坐标
    y: number;
}

interface SourceImg {
    img: any;
    imgUrl: string | ArrayBuffer | null;
    createImgUrl: string;
}

const fileInputRef = ref<HTMLInputElement>();

const canvasRef = ref<HTMLCanvasElement>();

const props = withDefaults(defineProps<IProps>(), {
    uploadAvatarVisible: false,
    width: 200,
    height: 200,
    thumbnail: ''
});

const { uploadAvatarVisible, width, height, thumbnail } = toRefs(props);

const emits = defineEmits([
    'crop-upload-success',
    'crop-upload-fail',
    'update:uploadAvatarVisible'
]);

const dialogVisible = ref(false);

watch(uploadAvatarVisible, (newVal) => {
    dialogVisible.value = newVal;
});

const onCropUploadSuccess = (fileObj: any) => {
    emits('crop-upload-success', fileObj);
};

const onCropUploadFail = (error: any) => {
    emits('crop-upload-fail', error);
};

const onUploadAvatarVisibleChanged = (visible: boolean) => {
    emits('update:uploadAvatarVisible', visible);
};

const sourceImgContainer = {
    width: 300,
    height: 240 // 如果生成图比例与此一致会出现bug，先改成特殊的格式吧，哈哈哈
};

const scale = reactive<Scale>({
    zoomAddOn: false,
    zoomSubOn: false,
    range: 1,
    rotateLeft: false,
    rotateRight: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    maxWidth: 0,
    maxHeight: 0,
    minWidth: 0,
    minHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0
});

const sourceImgMouseDown: SourceImgMouseDown = {
    on: false,
    mX: 0, // 鼠标按下的坐标
    mY: 0,
    x: 0, // scale原图坐标
    y: 0
};

const sourceImg = reactive<SourceImg>({
    img: '',
    imgUrl: '',
    createImgUrl: ''
});

const sourceImgStyle = computed(() => {
    const top = `${scale.y + sourceImgMasking.value.y}px`;
    const left = `${scale.x + sourceImgMasking.value.x}px`;
    return {
        top,
        left,
        width: `${scale.width}px`,
        height: `${scale.height}px`
    };
});

const sourceImgMasking = computed(() => {
    const sic = sourceImgContainer;
    const sicRatio = sic.width / sic.height; // 原图容器宽高比
    let x = 0;
    let y = 0;
    let w = sic.width;
    let h = sic.height;
    let scale = 1;
    if (ratio.value < sicRatio) {
        scale = sic.height / height.value;
        w = sic.height * ratio.value;
        x = (sic.width - w) / 2;
    }
    if (ratio.value > sicRatio) {
        scale = sic.width / width.value;
        h = sic.width / ratio.value;
        y = (sic.height - h) / 2;
    }
    return {
        scale, // 蒙版相对需求宽高的缩放
        x,
        y,
        width: w,
        height: h
    };
});

const sourceImgShadeStyle = computed(() => {
    const sic = sourceImgContainer;
    const sim = sourceImgMasking.value;
    const w = sim.width === sic.width ? sim.width : (sic.width - sim.width) / 2;
    const h = sim.height === sic.height ? sim.height : (sic.height - sim.height) / 2;
    return {
        width: `${w}px`,
        height: `${h}px`
    };
});

const rangeShow = computed(() => {
    return Boolean(sourceImg.img);
});

const ratio = computed(() => {
    return width.value / height.value;
});

const handleClick = () => {
    fileInputRef.value?.click();
};

const isAssetTypeAnImage = (ext: string) => {
    return ['png', 'jpg', 'jpeg', 'gif'].indexOf(ext.toLowerCase()) !== -1;
};

const data2blob = (data: any) => {
    let newData: any;
    newData = data.split(',')[1];
    newData = window.atob(newData);
    let ia = new Uint8Array(newData.length);
    for (let i = 0; i < newData.length; i++) {
        ia[i] = newData.charCodeAt(i);
    }
    return new Blob([ia], {
        type: 'image/png'
    });
};

// 将文件转换成base64格式
const getBase64 = (file: any) => {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        let reader = new FileReader();
        let imgResult: string | ArrayBuffer | null;
        reader.readAsDataURL(file);
        reader.onload = () => {
            imgResult = reader.result;
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.onloadend = () => {
            resolve(imgResult);
        };
    });
};

const fileChange = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const files: any = target.files;
    reset();
    const file: any = files[0];

    // 获取最后一个.的位置
    let index = file.name.lastIndexOf('.');
    // 获取后缀
    let ext = file.name.substring(index + 1);
    // 判断文件类型是否符合
    if (!isAssetTypeAnImage(ext)) {
        myMessage({
            type: 'error',
            message: '只能上传jpg/jpeg/png/gif文件!'
        });
        return false;
    }
    // 判断文件大小是否符合
    if (!(file.size / 1024 / 1024 <= 5)) {
        myMessage({
            type: 'error',
            message: '上传文件大小不能超过5MB!'
        });
        return false;
    }

    // 将图片地址赋值给裁剪框显示图片
    nextTick(() => {
        // 无法直接读取，先转成base64格式
        getBase64(file).then((data) => {
            sourceImg.imgUrl = data;
            startCrop();
        });
    });
};

const reset = () => {
    Object.assign(scale, {
        zoomAddOn: false, // 按钮缩放事件开启
        zoomSubOn: false, // 按钮缩放事件开启
        range: 1, // 最大100
        rotateLeft: false, // 按钮向左旋转事件开启
        rotateRight: false, // 按钮向右旋转事件开启
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0, // 最宽
        minHeight: 0,
        naturalWidth: 0, // 原宽
        naturalHeight: 0
    });
    // 原图片拖动事件初始值
    scale.sourceImgMouseDown = {
        on: false,
        mX: 0, // 鼠标按下的坐标
        mY: 0,
        x: 0, // scale原图坐标
        y: 0
    };

    Object.assign(sourceImg, {
        img: '',
        imgUrl: '',
        createImgUrl: ''
    });
};

/* 图片选择区域函数绑定 */
const preventDefault = (e: Event) => {
    e.preventDefault();
    return false;
};

// 剪裁前准备工作
const startCrop = () => {
    const sim = sourceImgMasking.value;
    const img = new Image();
    img.src = sourceImg.imgUrl as string;
    img.onload = () => {
        const nWidth = img.naturalWidth;
        const nHeight = img.naturalHeight;
        const nRatio = nWidth / nHeight;
        let w = sim.width;
        let h = sim.height;
        let x = 0;
        let y = 0;
        // 图片像素不达标
        if (nWidth < width.value || nHeight < height.value) {
            myMessage({
                type: 'warning',
                message: '图片像素不达标'
            });
            return false;
        }
        if (ratio.value > nRatio) {
            h = w / nRatio;
            y = (sim.height - h) / 2;
        }
        if (ratio.value < nRatio) {
            w = h * nRatio;
            x = (sim.width - w) / 2;
        }
        scale.range = 0;
        scale.x = x;
        scale.y = y;
        scale.width = w;
        scale.height = h;
        scale.minWidth = w;
        scale.minHeight = h;
        scale.maxWidth = nWidth * sim.scale;
        scale.maxHeight = nHeight * sim.scale;
        scale.naturalWidth = nWidth;
        scale.naturalHeight = nHeight;
        sourceImg.img = img;
        createImg();
    };
};

// 鼠标按下图片准备移动
const imgStartMove = (e: MouseEvent) => {
    e.preventDefault();
    const simd = sourceImgMouseDown;
    simd.mX = e.screenX;
    simd.mY = e.screenY;
    simd.x = scale.x;
    simd.y = scale.y;
    simd.on = true;
};

//鼠标按下状态下移动，图片移动
const imgMove = (e: MouseEvent) => {
    e.preventDefault();
    const { on, mX, mY, x, y } = sourceImgMouseDown;
    const sim = sourceImgMasking.value;
    const nX = e.screenX;
    const nY = e.screenY;
    const dX = nX - mX;
    const dY = nY - mY;
    let rX = x + dX;
    let rY = y + dY;
    if (!on) {
        return false;
    }
    if (rX > 0) {
        rX = 0;
    }
    if (rY > 0) {
        rY = 0;
    }
    if (rX < sim.width - scale.width) {
        rX = sim.width - scale.width;
    }
    if (rY < sim.height - scale.height) {
        rY = sim.height - scale.height;
    }
    scale.x = rX;
    scale.y = rY;
};

// 按钮按下开始放大
const startZoomAdd = () => {
    scale.zoomAddOn = true;
    const zoom = () => {
        if (scale.zoomAddOn) {
            const range = scale.range >= 100 ? 100 : ++scale.range;
            zoomImg(range);
            setTimeout(() => {
                zoom();
            }, 60);
        }
    };
    zoom();
};

// 按钮松开或移开取消放大
const endZoomAdd = () => {
    scale.zoomAddOn = false;
};

// 按钮按下开始缩小
const startZoomSub = () => {
    scale.zoomSubOn = true;
    const zoom = () => {
        if (scale.zoomSubOn) {
            const range = scale.range <= 0 ? 0 : --scale.range;
            zoomImg(range);
            setTimeout(() => {
                zoom();
            }, 60);
        }
    };
    zoom();
};

// 按钮松开或移开取消缩小
const endZoomSub = () => {
    scale.zoomSubOn = false;
};

const zoomChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    zoomImg(parseFloat(target.value));
};

// 缩放原图
const zoomImg = (newRange: number) => {
    const { maxWidth, maxHeight, minWidth, minHeight, width, height, x, y } = scale;
    const sim = sourceImgMasking.value;
    // 蒙版宽高
    const sWidth = sim.width;
    const sHeight = sim.height;
    // 新宽高
    const nWidth = minWidth + (maxWidth - minWidth) * newRange / 100;
    const nHeight = minHeight + (maxHeight - minHeight) * newRange / 100;
    // 新坐标（根据蒙版中心点缩放）
    let nX = sWidth / 2 - nWidth / width * (sWidth / 2 - x);
    let nY = sHeight / 2 - nHeight / height * (sHeight / 2 - y);
    // 判断新坐标是否超过蒙版限制
    if (nX > 0) {
        nX = 0;
    }
    if (nY > 0) {
        nY = 0;
    }
    if (nX < sWidth - nWidth) {
        nX = sWidth - nWidth;
    }
    if (nY < sHeight - nHeight) {
        nY = sHeight - nHeight;
    }
    // 赋值处理
    scale.x = nX;
    scale.y = nY;
    scale.width = nWidth;
    scale.height = nHeight;
    scale.range = newRange;
    setTimeout(() => {
        if (scale.range === newRange) {
            createImg();
        }
    }, 300);
};

// 生成需求图片
const createImg = (e?: Event | number) => {
    const canvas = canvasRef.value;
    if (!canvas) {
        return false;
    }
    const ctx: any = canvas?.getContext('2d');
    if (e) {
        // 取消鼠标按下移动状态
        sourceImgMouseDown.on = false;
    }
    canvas.width = width.value;
    canvas.height = height.value;
    ctx.clearRect(0, 0, width.value, height.value);
    // 将透明区域设置为白色底边
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width.value, height.value);
    ctx.translate(width.value * 0.5, height.value * 0.5);
    ctx.translate(-width.value * 0.5, -height.value * 0.5);
    ctx.drawImage(
        sourceImg.img,
        scale.x / sourceImgMasking.value.scale,
        scale.y / sourceImgMasking.value.scale,
        scale.width / sourceImgMasking.value.scale,
        scale.height / sourceImgMasking.value.scale
    );
    sourceImg.createImgUrl = canvas.toDataURL('image/png');
};

const submitUpload = () => {
    const uploadLoading = ElLoading.service({
        lock: true,
        text: '上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    if (!sourceImg.createImgUrl) {
        myMessage({
            type: 'warning',
            message: '请选择上传图片!'
        });
        uploadLoading.close();
        return false;
    }

    const file = data2blob(sourceImg.createImgUrl);

    //  用FormData存放上传文件
    let formData = new FormData();
    let key = Md5.hashStr(new Date().getTime().toString());
    formData.append('file', file, key);
    formData.append('key', key);

    CommonApi.getUploadToken({ keys: key, thumbnail: thumbnail.value })
        .then((res) => {
            let data = res.data[0];
            formData.append('token', data.token);
            CommonApi.uploadImg(formData)
                .then(() => {
                    let fileObj = {
                        key: key,
                        url: data.url
                    };
                    onCropUploadSuccess(fileObj);
                })
                .catch((error) => {
                    onCropUploadFail(error);
                })
                .finally(() => {
                    closeUpLoadImg();
                });
        })
        .catch((err) => {
            myMessage({
                type: 'error',
                message: err.msg || '获取上传token失败'
            });
        })
        .finally(() => {
            uploadLoading.close();
        });
};

const closeUpLoadImg = () => {
    reset();
    onUploadAvatarVisibleChanged(false);
};
</script>

<style scoped lang="scss">
.img-copper-wrapper {
    .img-copper-left {
        height: 360px;

        .img-copper-con {
            position: relative;
            width: 300px;
            height: 240px;
            margin: 0 auto;
            overflow: hidden;

            .img-copper-img {
                position: absolute;
                display: block;
                max-width: none;
                max-height: none;
                cursor: move;
                user-select: none;
            }

            .img-copper-img-shade {
                position: absolute;
                top: 0;
                background-color: rgba(241, 242, 243, 0.8);
            }

            .img-copper-img-shade-1 {
                left: 0;
            }

            .img-copper-img-shade-2 {
                right: 0;
            }
        }

        .img-copper-range {
            position: relative;
            width: 300px;
            height: 20px;
            margin: 20px auto;

            .img-copper-scale-input {
                display: block;
                padding-top: 5px;
                margin: 0 auto;
                width: 220px;
                height: 8px;
                vertical-align: top;
                background: transparent;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                cursor: pointer;

                &:focus {
                    outline: none;
                }

                &::-webkit-slider-thumb {
                    -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    -webkit-appearance: none;
                    appearance: none;
                    margin-top: -3px;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border-radius: 100%;
                    border: none;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                &::-moz-range-thumb {
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    -moz-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border-radius: 100%;
                    border: none;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                &::-ms-thumb {
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border: none;
                    border-radius: 100%;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                &:active::-moz-range-thumb {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    width: 14px;
                    height: 14px;
                }

                &:active::-ms-thumb {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    width: 14px;
                    height: 14px;
                }

                &:active::-webkit-slider-thumb {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    margin-top: -4px;
                    width: 14px;
                    height: 14px;
                }

                &::-webkit-slider-runnable-track {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    border-radius: 2px;
                    border: none;
                    background-color: rgba(68, 170, 119, 0.3);
                }

                &::-moz-range-track {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    border-radius: 2px;
                    border: none;
                    background-color: rgba(68, 170, 119, 0.3);
                }

                &::-ms-track {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    cursor: pointer;
                    background: transparent;
                    color: transparent;
                    height: 6px;
                    border-radius: 2px;
                    border: none;
                }

                &::-ms-fill-lower {
                    background-color: rgba(68, 170, 119, 0.3);
                }

                &::-ms-fill-upper {
                    background-color: rgba(68, 170, 119, 0.15);
                }

                &:focus::-webkit-slider-runnable-track {
                    background-color: rgba(68, 170, 119, 0.5);
                }

                &:focus::-moz-range-track {
                    background-color: rgba(68, 170, 119, 0.5);
                }

                &:focus::-ms-fill-lower {
                    background-color: rgba(68, 170, 119, 0.45);
                }

                &:focus::-ms-fill-upper {
                    background-color: rgba(68, 170, 119, 0.25);
                }
            }

            .img-copper-scale-down,
            .img-copper-scale-plus {
                position: absolute;
                top: 0;
                width: 18px;
                height: 18px;
                border-radius: 100%;
                background-color: rgba(0, 0, 0, 0.08);

                &:hover {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    cursor: pointer;
                    background-color: rgba(0, 0, 0, 0.14);
                }
            }

            .img-copper-scale-down {
                left: 6px;

                &::before {
                    position: absolute;
                    content: '';
                    display: block;
                    left: 3px;
                    top: 8px;
                    width: 12px;
                    height: 2px;
                    background-color: #fff;
                }
            }

            .img-copper-scale-plus {
                right: 6px;

                &::before {
                    position: absolute;
                    content: '';
                    display: block;
                    left: 3px;
                    top: 8px;
                    width: 12px;
                    height: 2px;
                    background-color: #fff;
                }

                &::after {
                    position: absolute;
                    content: '';
                    display: block;
                    top: 3px;
                    left: 8px;
                    width: 2px;
                    height: 12px;
                    background-color: #fff;
                }
            }
        }
    }

    .img-copper-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 360px;

        .size-one,
        .size-two {
            text-align: center;
            margin-bottom: 20px;
            letter-spacing: 3px;
            color: #9a9a9a;

            span {
                display: block;
                margin-top: 5px;
            }
        }
    }
}
</style>
