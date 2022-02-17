<template>
    <el-config-provider :locale="zhCn">
        <router-view />
    </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { initTheme } from '@/utils/theme';

onMounted(() => {
    initTheme();
});
</script>

<style>
#app {
    height: 100vh;
}
</style>
