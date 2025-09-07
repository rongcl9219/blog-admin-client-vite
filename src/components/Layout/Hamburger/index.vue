<template>
  <div
    class="hamburger-container"
    @click="toggleClick"
  >
    <svg-icon
      icon-class="menu-open"
      :class="{ 'is-active': isActive }"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'HamburgerIndex'
}
</script>
<script lang="ts" setup>
const emits = defineEmits(['toggle-click'])

defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

const toggleClick = () => {
  emits('toggle-click')
}
</script>

<style scoped lang="scss">
.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  padding: 0 15px;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  color: var(--el-color-primary);

  .svg-icon {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }

  .is-active {
    transform: rotate(180deg);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
</style>
