<template>
    <div class="footer">
        <p>本站由 @RongCL 创建 - © 2021. <a href="http://beian.miit.gov.cn/" target="_blank">皖ICP备2021014369号-1</a></p>
    </div>
</template>

<script lang="ts">
export default {
    name: 'FooterIndex'
};
</script>

<style scoped lang="scss">
.footer {
    height: 50px;
    border-top: 1px solid #e4e7ed;
    box-sizing: border-box;
    line-height: 49px;
    text-align: center;
    font-size: 14px;
    color: #222222;

    a {
        color: var(--el-color-primary);
    }
}
</style>
