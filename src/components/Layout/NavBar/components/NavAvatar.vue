<template>
  <el-dropdown
    class="avatar-container"
    trigger="click"
  >
    <template #default>
      <div class="avatar-wrapper">
        <el-avatar
          style="margin-right: 5px"
          shape="square"
          :size="40"
        >
          <img
            :src="userAvatar"
            alt="用户头像"
          >
        </el-avatar>
        <el-icon>
          <CaretBottom />
        </el-icon>
      </div>
    </template>
    <template #dropdown>
      <el-dropdown-menu class="user-dropdown">
        <el-dropdown-item @click="userInfoVisible = true">
          个人信息
        </el-dropdown-item>
        <el-dropdown-item @click="updatePasswordVisible = true">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item
          divided
          @click="loginOut"
        >
          <span style="display: block">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <UpdateUserInfo v-model:user-info-visible="userInfoVisible" />

  <UpdatePassword v-model:update-password-visible="updatePasswordVisible" />
</template>

<script lang="ts">
import { CaretBottom } from '@element-plus/icons-vue'

export default {
  name: 'NavAvatar',
  components: {
    CaretBottom
  }
}
</script>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import defaultUserImg from '@/assets/images/default_img/default_user.png'
import UpdateUserInfo from './UpdateUserInfo.vue'
import UpdatePassword from './UpdatePassword.vue'

const router = useRouter()
const userStore = useUserStore()

const userAvatar = computed(() => {
  const getAvatar = userStore.getAvatar
  return getAvatar || defaultUserImg
})

const userInfoVisible = ref(false)

const updatePasswordVisible = ref(false)

// 退出登录
const loginOut = () => {
  userStore.loginOut().finally(() => {
    router.replace('/login')
  })
}
</script>

<style scoped lang="scss">
.avatar-container {
  margin: 0 20px 0 10px;

  .avatar-wrapper {
    cursor: pointer;
  }
}
</style>
