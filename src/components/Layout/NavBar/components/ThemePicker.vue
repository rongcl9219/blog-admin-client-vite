<template>
    <div class="choose-theme">
        <svg-icon icon-class="theme" />
        <el-color-picker v-model="data.themeColor" :predefine="preDefineColors" @change="changeTheme" />
    </div>
</template>

<script lang="ts">
export default {
    name: 'ThemePicker'
};
</script>
<script setup lang="ts">
import { setTheme, themeColor } from '@/utils/theme';
import { reactive } from 'vue';
// 预设颜色
const preDefineColors: string[] = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    '#feabba'
];
// 默认颜色
const defaultColor = '#409eff';
// 主题颜色
const data = reactive({
    themeColor: themeColor || defaultColor
});

/**
 * @description: 更改主题颜色
 * @param color
 */
const changeTheme = (color: any) => {
    const themeColor = color || (data.themeColor = defaultColor);
    setTheme(themeColor);
};
</script>

<style lang="scss">
.choose-theme {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: var(--el-color-primary);

    .svg-icon {
        font-size: 24px;
    }

    .el-color-picker {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
}
</style>
