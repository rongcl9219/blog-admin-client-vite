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
import { useStore } from 'vuex';
import NavBar from './NavBar/index.vue';
import SideBar from './SideBar/index.vue';
import AppMain from './AppMain/index.vue';
import Footer from './Footer/index.vue';

const store = useStore();

const classObj = computed(() => {
    const isSidebarOpen = store.getters['setting/getSidebarOpen'];
    return {
        'hide-sidebar': isSidebarOpen,
        'open-sidebar': !isSidebarOpen
    };
});
</script>

<style scoped lang="scss">
.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }

    .main-container {
        min-height: 100%;
        transition: margin-left 0.28s;
        margin-left: 210px;
        position: relative;
    }
}

.hide-sidebar {
    .main-container {
        margin-left: 54px;
    }
}
</style>
