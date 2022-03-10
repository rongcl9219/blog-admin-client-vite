<template>
    <el-scrollbar>
        <div class="article-view">
            <transition name="fade">
                <template v-if="pageLoad">
                    <PageLoading />
                </template>
                <template v-else-if="articleInfo">
                    <div class="article-wrap">
                        <div class="article-content">
                            <section class="article-introduce">
                                <h1 class="article-title" v-text="articleInfo.articleTitle"></h1>
                                <p class="article-info" v-text="articleInfo.articleInfo"></p>
                                <div class="article-more">
                                    <el-icon class="el-icon"><Calendar /></el-icon>
                                    <span class="push-date">发表于{{ articleInfo.createDate }}</span>
                                    <svg-icon icon-class="circle" class="el-icon-third-yuan el-icon" />
                                    <el-icon class="el-icon"><FolderOpened /></el-icon>
                                    <div>
                                    <span
                                        class="underline"
                                        v-for="item in articleInfo.classTypeList"
                                        :key="item.classId"
                                    >{{ item.className }}</span
                                    >
                                    </div>
                                </div>
                            </section>
                            <section class="article-body">
                                <MdEditor :content="articleInfo.articleContent" :previewOnly="true" />
                            </section>
                            <el-divider></el-divider>
                            <section class="tag-group">
                                <el-tag
                                    v-for="item in articleInfo.tagTypeList"
                                    :key="item.tagId"
                                    class="tag-item"
                                >
                                    {{ item.tagName }}
                                </el-tag>
                            </section>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <NoData />
                </template>
            </transition>
        </div>
    </el-scrollbar>
</template>

<script lang="ts">
export default {
    name: 'ArticleView'
};
</script>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ArticleApi } from '@/api';
import PageLoading from '@/components/PageLoading/index.vue';
import NoData from '@/components/NoData/index.vue';
import { Calendar, FolderOpened } from '@element-plus/icons-vue';
import MdEditor from '@/components/MdEditor/index.vue';
import myMessage from '@/utils/myMessage';

const route = useRoute();

const pageLoad = ref(true);

const articleInfo = ref<any>(null);

const articleId = computed(() => {
    return route.query.articleId as string;
});

const getArticle = () => {
    ArticleApi.getArticleInfo(articleId.value)
        .then((res) => {
            articleInfo.value = res.data;
        })
        .catch(() => {
            myMessage({
                type: 'warning',
                message: '获取文章失败'
            });
        })
        .finally(() => {
            setTimeout(() => {
                pageLoad.value = false;
            }, 1000);
        });
};

onMounted(() => {
    getArticle();
});
</script>

<style scoped lang="scss">
.article-view {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 100%;
    min-height: calc(100vh - 60px);
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;

    .article-wrap {
        width: 100%;
        padding: 40px 30px;
        transition: 0.3s;
    }

    .article-content {
        position: relative;
        margin: 40px 0;
        padding: 40px 30px 40px 40px;
        transition: 0.3s;
    }

    .article-title {
        text-align: center;
        font-size: 30px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .article-info {
        text-indent: 2em;
        font-size: 16px;
        font-weight: 400;
        font-family: '新宋体', sans-serif;
        line-height: 22px;
    }

    .article-more {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #666;
        margin: 10px;

        .el-icon {
            margin: 0 5px;
        }

        .el-icon-third-yuan {
            font-size: 12px;
            transform: scale(0.5);
        }

        .underline {
            position: relative;
            margin-right: 5px;
            padding-bottom: 2px;
            border-bottom: 1px solid #222;
            cursor: pointer;
        }
    }

    .article-body {
        padding: 30px 0;
        background-color: #ffffff;
    }

    .comment {
        margin: 20px 0;
    }

    .tag-item {
        margin-right: 10px;
        cursor: pointer;
        border: none;
        line-height: 2;
    }
}

@media screen and (max-width: 720px) {
    .article-view .article-wrap {
        padding: 0;

        .article-content {
            margin: 0;
            padding: 40px 20px;
            box-shadow: none;
        }
    }
}
</style>
