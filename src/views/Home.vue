<template>
  <div>
    <van-sticky>
      <!-- 导航栏，动态显示昵称 -->
      <van-nav-bar
        title="首页"
        :right-text="'您好.' + nick"
        @click-right="gomy"
      ></van-nav-bar>
      <!-- 公告 -->
      <van-notice-bar
        left-icon="volume-o"
        text="星座卡组（阴）全新上线，‘教皇’ 重做归来爆出概率 up！ 欢迎大家前来参与！"
      />
    </van-sticky>
    <!-- 轮播图 -->
    <van-row type="flex" justify="center">
      <van-col span="23">
        <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
          <van-swipe-item
            v-for="(item, index) in swiperList"
            :key="item.id"
            @click="showDetails(index)"
          >
            <van-image :src="item.imgurl" />
          </van-swipe-item>
        </van-swipe>
      </van-col>
    </van-row>
    <!-- 分割线 -->
    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      热门抽卡
    </van-divider>
    <!-- 抽卡活动列表 -->
    <van-row
      type="flex"
      justify="center"
      class="context"
      v-for="item in cellList"
      :key="item.id"
    >
      <van-col span="23">
        <van-cell :label="item.label" :title="item.title" :icon="item.icon">
          <template #default>
            <van-button type="info" size="mini" @click="golottery(item.id)"
              >去抽卡</van-button
            >
          </template>
        </van-cell>
      </van-col>
    </van-row>
    <van-row class="context"> </van-row>
    <!-- 底部导航栏 -->
    <Tabbar :id="id" />
  </div>
</template>

<script>
import Tabbar from "../components/Tabbar.vue";

export default {
  name: "Home",
  components: {
    Tabbar,
  },
  data() {
    return {
      id: this.$route.query.id,
      nick: "",
      swiperList: [],
      cellList: [],
    };
  },
  mounted() {
    this.select();
  },
  methods: {
    select() {
      this.$axios
        .get("/users?id=" + this.id)
        .then((res) => {
          if (res.statusText == "OK") {
            if (res.data.length == 0) {
              console.log(res);
            } else {
              this.nick = res.data[0].nick;
            }
          } else {
            console.log(res);
            this.$toast.fail("服务连接错误");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("服务连接错误");
        });
      this.$axios
        .get("/homeSwiperList")
        .then((res) => {
          if (res.statusText == "OK") {
            this.swiperList = res.data;
            this.swiperList.forEach((item) => {
              item.imgurl = require("../" + item.imgurl);
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
      this.$axios
        .get("/homeCellList")
        .then((res) => {
          if (res.statusText == "OK") {
            this.cellList = res.data;
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
    showDetails(index) {
      this.$dialog
        .alert({
          title: this.swiperList[index].name,
          message: this.swiperList[index].message,
          theme: "round-button",
        })
        .then(() => {
          // on close
        });
    },
    gomy() {
      this.$router.push({
        path: "/my",
        query: { id: this.id },
      });
    },
    golottery(activityid) {
      this.$router.push({
        path: "/lottery/" + this.id + "/" + activityid,
      });
    },
  },
};
</script>

<style scoped>
.my-swipe {
  border-radius: 20px;
  margin-top: 10px;
}
.context {
  margin-top: 15px;
}
</style>