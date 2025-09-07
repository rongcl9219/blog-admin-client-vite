<template>
  <div class="nav-right">
    <ThemePicker />
    <NavAvatar />
  </div>
</template>

<script lang="ts">
import ThemePicker from '@/components/Layout/NavBar/components/ThemePicker.vue'
import NavAvatar from '@/components/Layout/NavBar/components/NavAvatar.vue'

export default {
  name: 'NavRight',
  components: {
    ThemePicker,
    NavAvatar
  }
}
</script>

<style scoped lang="scss">
.nav-right {
  float: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  line-height: 50px;

  &:focus {
    outline: none;
  }
}
</style>
