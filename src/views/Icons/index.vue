<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane
      label="Icons"
      name="icons"
    >
      <ul class="icon-grid">
        <li
          v-for="key in iconList"
          :key="key"
          class="grid-item"
        >
          <svg-icon :icon-class="key" />
          <p>{{ key }}</p>
          <div
            class="icon-cover"
            @click="handleClipboard(generateIconCode(key), $event)"
          />
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane
      label="element-plus icons"
      name="elIcons"
    >
      <ul class="icon-grid">
        <li
          v-for="key in elIconsList"
          :key="key"
          class="grid-item"
        >
          <span style="width: 20px; height: 20px">
            <component :is="key" />
          </span>
          <p>{{ key }}</p>
          <div
            class="icon-cover"
            @click="handleClipboard(generateElIconCode(key), $event)"
          />
        </li>
      </ul>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import * as elIcons from '@element-plus/icons-vue'

export default {
  name: 'IconsAdmin',
  components: {
    ...elIcons
  }
}
</script>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import iconList from './icons'
import clipboard from '@/utils/clipboard'

const activeTab = ref('icons')

const elIconsList = ref<string[]>([])

const generateIconCode = (symbol: string): string => {
  return `<svg-icon icon-class="${symbol}" />`
}

const generateElIconCode = (symbol: string): string => {
  return `<el-icon><${symbol} /></el-icon>`
}

const handleClipboard = (text: string, event: MouseEvent): void => {
  clipboard(text, event)
}

const initElIcons = (): string[] => {
  const arr: string[] = []
  for (const key in elIcons) {
    arr.push(key)
  }
  return arr
}

onBeforeMount(() => {
  elIconsList.value = initElIcons()
})
</script>

<style scoped lang="scss">
@use '@/style/mixin.scss' as *;

.icon-grid {
  position: relative;
  display: grid;
  border-radius: 4px;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  max-height: calc(100vh - 185px);
  overflow-x: hidden;
  overflow-y: auto;

  @include scrollBar;
}

.grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  float: left;
  width: 100px;
  height: 85px;
  padding: 20px;
  text-align: center;
  font-size: 20px;
  color: #222;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: var(--el-color-primary);
  }

  p {
    margin-top: 10px;
    font-size: 14px;
  }

  .icon-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .icon {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
