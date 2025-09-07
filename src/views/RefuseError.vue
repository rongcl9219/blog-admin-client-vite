<template>
  <div class="page403_container">
    <div class="page403_http403">
      <div class="pic_403">
        <img
          class="pic_403__parent"
          src="@/assets/images/error_images/403.png"
          alt="403"
        >
      </div>
      <div class="tips">
        <div class="tips__headline">
          {{ msg }}
        </div>
        <div class="tips__info">
          {{ tips }}
        </div>
        <a
          :href="loginPath"
          class="tips__return-home"
        >重新登录</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useUserStore } from '@/store/user'

const loginPath = '/login'
const msg = '您的请求被拒绝'
const tips = '请确定你已登录，或者点击下方按钮返回登录页面'
const userStore = useUserStore()

onBeforeMount(() => {
  userStore.loginOut()
})
</script>

<style scoped lang="scss">
.page403_container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 80%;
  margin: 0 auto;
  max-width: 1100px;
}

.page403_http403 {
  position: relative;
  width: 100%;
  padding: 0 50px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  .pic_403 {
    position: relative;
    float: left;
    width: 65%;
    overflow: hidden;

    &__parent {
      width: 100%;
    }
  }

  .tips {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;

    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }

    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}

@media screen and (max-width: 720px) {
  .page403_container {
    width: 100%;
    max-width: 100%;
  }
  .page403_http403 {
    flex-direction: column;

    .pic_403 {
      width: 100%;
    }
  }
}
</style>
