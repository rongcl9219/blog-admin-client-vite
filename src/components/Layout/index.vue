<template>
    <div class="app-wrapper" :class="classObj">
        <SideBar />
        <div class="main-container">
            <NavBar />
            <AppMain />
            <Footer />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'AdminLayout'
};
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import { useSettingStore } from '@/store/setting';
import NavBar from './NavBar/index.vue';
import SideBar from './SideBar/index.vue';
import AppMain from './AppMain/index.vue';
import Footer from './Footer/index.vue';

const settingStore = useSettingStore();

const classObj = computed(() => {
    return {
        'hide-sidebar': settingStore.getSidebarOpen
    };
});
</script>

<style scoped lang="scss">
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .main-container {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-left: 210px;
        transition: margin-left 0.1s;
    }
}

.hide-sidebar {
    .main-container {
        margin-left: 54px;
    }
}
</style>
