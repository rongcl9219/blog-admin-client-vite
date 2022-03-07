<template>
    <svg :class="svgClass" aria-hidden="true" v-bind="$attrs">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script lang="ts" setup>
import { toRefs, computed } from 'vue';
const props = defineProps({
    iconClass: {
        type: String,
        required: true
    },
    className: String
});

const { iconClass, className } = toRefs(props);

const iconName = computed(() => {
    return `#icon-${iconClass?.value}`;
});

const svgClass = computed(() => {
    return 'svg-icon ' + (className?.value || '');
});
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>
