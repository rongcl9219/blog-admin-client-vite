/**
 * @description 后台管理路由
 */
// 后台布局
const AdminLayout = () => import('@/components/Layout/index.vue')

// 后台首页
const AdminMain = () => import('@/views/Main/index.vue')

// 分类管理页面
const AdminClass = () => import('@/views/Class/index.vue')

// 标签管理页面
const AdminTag = () => import('@/views/Tag/index.vue')

// 文章管理页面
const AdminArticle = () => import('@/views/Article/index.vue')

// 网站信息管理页面
const AdminWebInfo = () => import('@/views/WebInfo/index.vue')

const AdminIcons = () => import('@/views/Icons/index.vue')

const ArticleView = () => import('@/views/ArticleView/index.vue')

export default [
  {
    path: '/',
    name: 'AdminLayout',
    component: AdminLayout,
    redirect: {
      name: 'AdminMain'
    },
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'main',
        name: 'AdminMain',
        component: AdminMain,
        meta: {
          requiresAuth: true,
          title: '主页'
        }
      },
      {
        path: 'class',
        name: 'AdminClass',
        component: AdminClass,
        meta: {
          requiresAuth: true,
          title: '分类'
        }
      },
      {
        path: 'tag',
        name: 'AdminTag',
        component: AdminTag,
        meta: {
          requiresAuth: true,
          title: '标签'
        }
      },
      {
        path: 'article',
        name: 'AdminArticle',
        component: AdminArticle,
        meta: {
          requiresAuth: true,
          title: '文章'
        }
      },
      {
        path: 'webInfo',
        name: 'AdminWebInfo',
        component: AdminWebInfo,
        meta: {
          requiresAuth: true,
          title: '网站信息'
        }
      },
      {
        path: 'icons',
        name: 'AdminIcons',
        component: AdminIcons,
        meta: {
          requiresAuth: true,
          title: '图标'
        }
      }
    ]
  },
  {
    path: '/articleView',
    name: 'ArticleView',
    component: ArticleView,
    meta: {
      requiresAuth: true,
      title: '文章预览'
    }
  }
]
