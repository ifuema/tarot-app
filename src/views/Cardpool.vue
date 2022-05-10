<template>
  <div>
    <!-- 导航栏 -->
    <van-sticky>
      <van-nav-bar title="卡池"></van-nav-bar>
    </van-sticky>
    <!-- 宫格展示卡牌 -->
    <van-row type="flex" justify="center">
      <van-col span="23">
        <van-grid :column-num="2" :gutter="5">
          <van-grid-item v-for="item in cardList" :key="item.id">
            <van-image
              :src="item.icon"
              style="height: 100%"
              @click="open(item.icon)"
            /><br />
            <div style="color: #646566">{{ item.text }}</div>
          </van-grid-item>
        </van-grid>
      </van-col>
    </van-row>
    <!-- 底部导航栏 -->
    <Tabbar :id="id" />
  </div>
</template>

<script>
import Tabbar from "../components/Tabbar.vue";
import { ImagePreview } from "vant";

export default {
  name: "Cardpool",
  components: {
    Tabbar,
  },
  data() {
    return {
      id: this.$route.query.id,
      cardList: [],
    };
  },
  mounted() {
    this.select();
  },
  methods: {
    select() {
      this.$axios
        .get("/cardList")
        .then((res) => {
          if (res.statusText == "OK") {
            this.cardList = res.data;
            this.cardList.forEach((item) => {
              item.icon = require("../" + item.icon);
            });
          } else {
            console.log(res);
            this.$toast.fail("服务连接错误");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("服务连接错误");
        });
    },
    open(url) {
      ImagePreview({
        images: [url],
        showIndex: false,
        className: "preview",
      });
    },
  },
};
</script>

<style>
.preview {
  width: 70%;
  margin-left: 15%;
}
</style>