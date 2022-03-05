<template>
    <div class="no_data">
        <img :src="noDataImage" alt="" />
        <p>{{ noDateText }}</p>
    </div>
</template>

<script lang="ts">
import noDataImage from '@/assets/images/default_img/no_data.png';
export default {
    name: 'NoData',
    props: {
        noDateText: {
            type: String,
            default: '什么都没有'
        }
    },
    computed: {
        noDataImage() {
            return noDataImage;
        }
    }
};
</script>

<style scoped lang="scss">
.no_data {
    margin-top: 7%;
    text-align: center;

    p {
        font-family: zcool-kuaile, sans-serif;
        font-size: 24px;
        color: var(--el-color-primary);
    }
}
</style>
