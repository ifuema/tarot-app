<template>
  <div>
    <van-tabbar active-color="#3C68ED" route placeholder>
      <van-tabbar-item
        icon="wap-home"
        :to="{ path: '/home', query: { id: this.id } }"
        >首页</van-tabbar-item
      >
      <van-tabbar-item
        icon="award"
        :to="{ path: '/cardpool', query: { id: this.id } }"
        >卡池</van-tabbar-item
      >
      <van-tabbar-item
        icon="send-gift"
        :to="{ path: '/house', query: { id: this.id } }"
        >仓库</van-tabbar-item
      >
      <van-tabbar-item
        icon="manager"
        :to="{ path: '/my', query: { id: this.id } }"
        >我的</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Tabbar",
  props: ["id"],
};
</script>

<style>
</style>