<template>
    <div class="nav-bar">
        <Hamburger :is-active="isSidebarOpen" @toggleClick="toggleSideBar" />
        <Breadcrumb />
    </div>
</template>

<script lang="ts">
export default {
    name: 'NavBar'
};
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Breadcrumb from '@/components/Layout/Breadcrumb/index.vue';
import Hamburger from '@/components/Layout/Hamburger/index.vue';

const store = useStore();

const isSidebarOpen = computed(() => {
    return store.getters['setting/getSidebarOpen'];
});

const toggleSideBar = () => {
    store.dispatch('setting/toggleSideBar');
};
</script>

<style scoped lang="scss">
.nav-bar {
    position: relative;
    width: 100%;
    height: 50px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    transition: width 0.28s;
    overflow: hidden;
}
</style>
