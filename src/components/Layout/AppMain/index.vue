<template>
  <div class="app-main">
    <el-scrollbar>
      <div class="app-main-content">
        <router-view v-slot="{ Component }">
          <transition
            name="fade-transform"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AppMain'
}
</script>

<style scoped lang="scss">
.app-main {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  .app-main-content {
    padding: 10px;
  }
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
