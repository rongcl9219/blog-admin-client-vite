<template>
    <div class="valid-code-box" :style="`width:${width}px; height:${height}px`" @click="getCode">
        <span v-for="(item, index) in data.codeList" :key="index" :style="getStyle(item)">{{
            item.code
        }}</span>
    </div>
</template>

<script lang="ts">
export default {
    name: 'ValidCode'
};
</script>
<script lang="ts" setup>
import { toRefs, watch, reactive, onMounted } from 'vue';
import { CommonApi } from '@/api';

interface ValidCodeItem {
    code: string;
    color: string;
    fontSize: string;
    padding: string;
    transform: string;
}

interface ValidCodeList {
    codeList: Array<ValidCodeItem>;
}

const emits = defineEmits(['update:validCode']);

const props = defineProps({
    validCode: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 150
    },
    height: {
        type: Number,
        default: 40
    },
    refresh: {
        type: Number,
        default: 0
    }
});

const data = reactive<ValidCodeList>({
    codeList: []
});

const { width, height, refresh } = toRefs(props);

watch(refresh, () => {
    getCode();
});

const getCode = () => {
    CommonApi.getValidCode().then((res) => {
        createCode(res.data.validCode);
    });
};

const createCode = (codeArr: string[]) => {
    let codeList: Array<ValidCodeItem> = [];

    codeArr.forEach((code: string) => {
        const rgb = [
            Math.round(Math.random() * 200),
            Math.round(Math.random() * 220),
            Math.round(Math.random() * 200)
        ];
        codeList.push({
            code: code,
            color: `rgb(${rgb})`,
            fontSize: `${10 + (Number([Math.floor(Math.random() * 10)]) + 6)}px`,
            padding: `${[Math.floor(Math.random() * 10)]}px`,
            transform: `rotate(${
                Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)
            }deg)`
        });
    });

    data.codeList = codeList;

    onValidCodeChanged();
};

const getStyle = (data: ValidCodeItem) => {
    return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`;
};

const onValidCodeChanged = () => {
    const code = data.codeList.map((item: ValidCodeItem) => item.code).join('');
    emits('update:validCode', code);
};

onMounted(() => {
    getCode();
});
</script>

<style scoped>
.valid-code-box {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 150px;
    background-color: rgba(204, 204, 204, 0.3);
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
}
.valid-code-box span {
    display: inline-block;
}
</style>
