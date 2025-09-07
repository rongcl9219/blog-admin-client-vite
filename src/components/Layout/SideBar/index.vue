<template>
  <div class="sidebar-container">
    <el-scrollbar>
      <el-menu
        class="sidebar-menu"
        :default-active="defaultPath"
        :collapse="isSidebarOpen"
        :unique-opened="false"
        :collapse-transition="false"
        :router="true"
      >
        <el-menu-item
          index="/main"
          :class="{ 'submenu-title-noDropdown': isSidebarOpen }"
        >
          <svg-icon icon-class="home-page" />
          <template #title>
            <span>主页</span>
          </template>
        </el-menu-item>
        <el-menu-item
          index="/class"
          :class="{ 'submenu-title-noDropdown': isSidebarOpen }"
        >
          <svg-icon icon-class="class-manage" />
          <template #title>
            <span>分类管理</span>
          </template>
        </el-menu-item>
        <el-menu-item
          index="/tag"
          :class="{ 'submenu-title-noDropdown': isSidebarOpen }"
        >
          <svg-icon icon-class="tag" />
          <template #title>
            <span>标签管理</span>
          </template>
        </el-menu-item>
        <el-menu-item
          index="/article"
          :class="{ 'submenu-title-noDropdown': isSidebarOpen }"
        >
          <svg-icon icon-class="article-manage" />
          <template #title>
            <span>文章管理</span>
          </template>
        </el-menu-item>
        <el-menu-item
          index="/webInfo"
          :class="{ 'submenu-title-noDropdown': isSidebarOpen }"
        >
          <svg-icon icon-class="heart" />
          <template #title>
            <span>网站信息</span>
          </template>
        </el-menu-item>
        <el-menu-item
          index="/icons"
          :class="{ 'submenu-title-noDropdown': isSidebarOpen }"
        >
          <svg-icon icon-class="icon-img" />
          <template #title>
            <span>图标</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SideBar'
}
</script>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()
const route = useRoute()

const isSidebarOpen = computed(() => {
  return settingStore.getSidebarOpen
})

const defaultPath = computed(() => {
  return route.path
})
</script>

<style scoped lang="scss">
.sidebar-container {
  width: 210px;
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.04), 0 8px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: width 0.1s;

  .el-menu {
    border: none;
    width: 100% !important;
  }

  .svg-icon {
    font-size: 16px;
    margin-right: 5px;
  }
}

.hide-sidebar {
  .sidebar-container {
    width: 54px;
  }

  .svg-icon {
    margin-right: 0;
  }
}
</style>
