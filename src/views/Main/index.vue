<template>
  <div class="home-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <p style="color: rgb(107, 132, 148)">
            <span
              class="header-title"
              style="margin-right: 20px"
            >欢迎光临</span>【火星的青青草原-管理后台】
          </p>
        </div>
      </template>
      <el-card
        class="box-card"
        style="margin-bottom: 20px"
      >
        <template #header>
          <div class="clearfix">
            <span class="header-title">关于开源项目【火星的青青草原】</span>
          </div>
        </template>
        <div>
          <h3 class="header-title">
            项目相关
          </h3>
          <ul>
            <li
              v-for="(item, index) in githubArr"
              :key="index"
              class="list-item about"
            >
              <el-link
                :underline="false"
                type="primary"
                target="_blank"
                :href="item.link"
              >
                <span class="list-item-title"><svg-icon icon-class="circle" />{{ item.name }}：<span>{{
                  item.link
                }}</span></span>
              </el-link>
            </li>
          </ul>
        </div>
      </el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span class="header-title">最近发布</span>
              </div>
            </template>
            <div>
              <ul>
                <li
                  v-for="article in currentArticles"
                  :key="article.articleId"
                  class="list-article"
                >
                  <el-link
                    :underline="false"
                    target="_blank"
                    :href="'/article?articleId=' + article.articleId"
                  >
                    <span class="list-time">{{
                      formatDate('yyyy-MM-dd hh:mm', article.createDate)
                    }}</span>
                    <span class="article-title">{{
                      article.articleTitle
                    }}</span>
                  </el-link>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span class="header-title">近期评论</span>
              </div>
            </template>
            <div>
              <h3 class="header-title">
                项目相关
              </h3>
              <ul>
                <li>开源项目地址</li>
                <li>博主网站首页</li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MainAdmin'
}
</script>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { ArticleApi } from '@/api'
import { formatDate } from '@/utils/tools'

const githubArr: Array<any> = [
  { name: '博主网站首页', link: 'http://rongcl.cn' },
  { name: '开源项目地址', link: 'https://github.com/rongcl9219' },
  {
    name: '前台项目地址',
    link: 'https://github.com/rongcl9219/my-blog-client'
  },
  {
    name: '后台项目地址',
    link: 'https://github.com/rongcl9219/my-blog-server'
  }
]

const currentArticles = ref<Array<any>>([])

onBeforeMount(() => {
  ArticleApi.getCurrentArticles()
    .then((res) => {
      currentArticles.value = res.data
    })
    .catch(() => {
      return false
    })
})
</script>

<style scoped lang="scss">
.home-page {
  .header-title {
    color: #42657b;
    font-size: 20px;
  }

  .about {
    padding-left: 20px;
  }

  .list-item {
    display: flex;
    align-items: center;
    line-height: 28px;

    .list-item-title {
      display: flex;
      align-items: center;
      color: #42657b;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }

      span {
        color: var(--el-color-primary);
      }
    }

    .svg-icon {
      margin-right: 10px;
      font-size: 12px;
      transform: scale(0.7);
    }
  }

  .list-article {
    height: 28px;

    a:hover {
      color: var(--el-color-primary);
      transition: 0.3s;
    }

    .list-time {
      font-size: 15px;
    }

    .article-title {
      font-size: 15px;
      padding-left: 10px;
      color: var(--el-color-primary);
    }
  }
}
</style>
