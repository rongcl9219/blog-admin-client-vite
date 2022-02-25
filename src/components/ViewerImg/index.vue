<template>
    <div class="view-image" ref="viewerRef">
        <slot :images="images" :options="options"></slot>
    </div>
</template>

<script lang="ts">
export default {
    name: 'ViewerImg'
};
</script>
<script lang="ts" setup>
import { toRefs, watch, computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { viewerDefaultOptions } from './config.ts';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

interface IProps {
    images?: any;
    rebuild?: boolean;
    options?: any;
}

const props = withDefaults(defineProps<IProps>(), {
    images: null,
    rebuild: false,
    options: {}
});

const { images, rebuild, options } = toRefs(props);

const viewerRef = ref<HTMLElement>();

const viewerObj = ref();

watch(images, () => {
    nextTick(() => {
        onChange();
    });
}, { deep: true });

watch(options, () => {
    nextTick(() => {
        onChange();
    });
}, { deep: true });

const viewerOptions = computed(() => {
    return Object.assign({}, viewerDefaultOptions, options.value);
});

const onChange = () => {
    if (rebuild.value) {
        rebuildViewer();
    } else {
        updateViewer();
    }
};

const rebuildViewer = () => {
    destroyViewer();
    createViewer();
};

const updateViewer = () => {
    if (viewerObj.value) {
        viewerObj.value.update();
    } else {
        createViewer();
    }
};

const destroyViewer = () => {
    if (viewerObj.value) {
        viewerObj.value.destroy();
    }
};

const createViewer = () => {
    viewerObj.value = new Viewer(viewerRef.value, viewerOptions.value);
};

// eslint-disable-next-line no-unused-vars
const show = (index: number) => {
    if (viewerObj.value) {
        viewerObj.value.view(index || 0);
    }
};

onMounted(() => {
    createViewer();
});

onUnmounted(() => {
    destroyViewer();
});
</script>

<style scoped>
.view-image {
    display: inline;
    vertical-align: top;
}
</style>
