<template>
  <div class="nav-bar">
    <Hamburger
      :is-active="isSidebarOpen"
      @toggle-click="toggleSideBar"
    />
    <Breadcrumb />
    <NavRight />
  </div>
</template>

<script lang="ts">
export default {
  name: 'NavBar'
}
</script>
<script lang="ts" setup>
import { computed } from 'vue'
import { useSettingStore } from '@/store/setting'
import Breadcrumb from '@/components/Layout/Breadcrumb/index.vue'
import Hamburger from '@/components/Layout/Hamburger/index.vue'
import NavRight from '@/components/Layout/NavBar/components/NavRight.vue'

const settingStore = useSettingStore()

const isSidebarOpen = computed(() => {
  return settingStore.getSidebarOpen
})

const toggleSideBar = () => {
  settingStore.toggleSideBar()
}
</script>

<style scoped lang="scss">
.nav-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 210px;
  z-index: 50;
  //width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(54, 64, 67, 0.1), 0 1px 3px rgb(54, 64, 67, 0.15);
  transition: width 0.28s;
  overflow: hidden;
}
</style>
