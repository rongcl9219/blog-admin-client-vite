<template>
  <div
    ref="viewerRef"
    class="view-image"
  >
    <slot
      :images="images"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ViewerImg'
}
</script>
<script lang="ts" setup>
import { toRefs, watch, computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { viewerDefaultOptions } from './config'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

interface IProps {
  images?: any;
  rebuild?: boolean;
  options?: any;
}

const props = withDefaults(defineProps<IProps>(), {
  images: null,
  rebuild: false,
  options: {}
})

const { images, rebuild, options } = toRefs(props)

const viewerRef = ref<HTMLElement>()

const viewerObj = ref()

watch(
  images,
  () => {
    nextTick(() => {
      onChange()
    })
  },
  { deep: true }
)

watch(
  options,
  () => {
    nextTick(() => {
      onChange()
    })
  },
  { deep: true }
)

const viewerOptions = computed(() => {
  return Object.assign({}, viewerDefaultOptions, options.value)
})

const onChange = () => {
  if (rebuild.value) {
    rebuildViewer()
  } else {
    updateViewer()
  }
}

const rebuildViewer = () => {
  destroyViewer()
  createViewer()
}

const updateViewer = () => {
  if (viewerObj.value) {
    viewerObj.value.update()
  } else {
    createViewer()
  }
}

const destroyViewer = () => {
  if (viewerObj.value) {
    viewerObj.value.destroy()
  }
}

const createViewer = () => {
  const ele = viewerRef.value as HTMLElement
  viewerObj.value = new Viewer(ele, viewerOptions.value)
}

onMounted(() => {
  createViewer()
})

onUnmounted(() => {
  destroyViewer()
})
</script>

<style scoped>
.view-image {
  display: inline;
  vertical-align: top;
}
</style>
