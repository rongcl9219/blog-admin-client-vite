<template>
    <el-breadcrumb class="breadcrumb-container" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in data.levelList" :key="item.path">
                <span
                    v-if="item.redirect === 'noRedirect' || index === data.levelList.length - 1"
                    class="no-redirect"
                    >{{ item.meta.title }}</span
                >
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts">
export default {
    name: 'BreadcrumbIndex'
};
</script>
<script lang="ts" setup>
import { watch, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as pathToRegexp from 'path-to-regexp';

interface MetaItem {
    title: string;
    breadcrumb: boolean;
}

interface RouteItem {
    name: string;
    path: string;
    meta: MetaItem;
}

interface LevelList {
    levelList: Array<RouteItem>;
}

const router = useRouter();
const route = useRoute();

const data = reactive<LevelList>({
    levelList: []
});

const handleLink = (item: any) => {
    const { redirect, path } = item;
    if (redirect) {
        router.push(redirect);
        return;
    }
    router.push(pathCompile(path));
};

const getBreadcrumb = () => {
    let matched: Array<any> = route.matched.filter((item) => item.meta && item.meta.title);
    const first = matched[0];
    if (!isDashboard(first)) {
        matched = [{ path: '/main', meta: { title: '主页' } }].concat(matched);
    }

    data.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
    );
};

const isDashboard = (route: any) => {
    const name = route && route.name;
    if (!name) {
        return false;
    }
    return name.trim().toLocaleLowerCase() === 'AdminMain'.toLocaleLowerCase();
};

const pathCompile = (path: any) => {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    const { params } = route;
    let toPath = pathToRegexp.compile(path);
    return toPath(params);
};

watch(route, () => {
    getBreadcrumb();
});

onMounted(() => {
    getBreadcrumb();
});
</script>

<style lang="scss" scoped>
.breadcrumb-container {
    float: left;
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
    transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(80px);
}

.breadcrumb-move {
    transition: all .5s;
}

.breadcrumb-leave-active {
    position: absolute;
}
</style>
