<template>
  <div>
    <!-- 导航栏，动态显示剩余金币 -->
    <van-sticky>
      <van-nav-bar
        :title="activity.title"
        left-text="返回"
        left-arrow
        @click-left="gohome()"
      >
        <template #right>
          <van-icon name="gold-coin-o" />&nbsp;
          <span style="color: orange">{{ user.balance }}</span>
        </template>
      </van-nav-bar>
    </van-sticky>
    <!-- 卡组信息展示列表 -->
    <van-cell title="单抽价格" :value="activity.price" />
    <van-cell title="上架日期" :value="activity.day" />
    <van-cell title="卡组牌数" :value="cardList.length" />
    <van-cell title="您将有机会从以下牌组中随机获得一张卡牌：" />
    <!-- 卡牌图片展示列表 -->
    <van-grid :column-num="cardList.length" :gutter="5">
      <van-grid-item v-for="item in cardList" :key="item.id">
        <van-image
          :src="item.icon"
          style="height: 100%"
          @click="open(item.icon)"
        /><br />
        <div style="color: #646566">{{ item.text }}</div>
      </van-grid-item>
    </van-grid>
    <!-- 抽卡按钮 -->
    <van-row type="flex" justify="center" class="context">
      <van-col>
        <van-button
          type="info"
          round
          color="linear-gradient(to right, #2CBDDC, #3C68ED)"
          @click="show()"
        >
          抽
        </van-button>
      </van-col>
    </van-row>
    <van-row class="top"> </van-row>
    <!-- 抽中卡牌提示 -->
    <van-dialog
      v-model="visible"
      :title="'恭喜抽中卡牌：' + randomcard.text"
      theme="round-button"
    >
      <van-image :src="randomcard.icon" class="preview" />
      <div style="text-align: center; color: #969799">卡牌已加入您的仓库</div>
    </van-dialog>
  </div>
</template>

<script>
import { ImagePreview } from "vant";

export default {
  name: "Lottery",
  data() {
    return {
      userid: this.$route.params.userid,
      activityid: this.$route.params.activityid,
      activity: {},
      cardList: [],
      user: {},
      visible: false,
      randomcard: {},
    };
  },
  mounted() {
    this.select();
  },
  methods: {
    select() {
      this.$axios
        .get("/homeCellList?id=" + this.activityid)
        .then((res) => {
          if (res.statusText == "OK") {
            this.activity = res.data[0];
            this.activity.card.forEach((item) => {
              this.$axios
                .get("/cardList?id=" + item)
                .then((res) => {
                  if (res.statusText == "OK") {
                    res.data[0].icon = require("../" + res.data[0].icon);
                    this.cardList.push(res.data[0]);
                  } else {
                    console.log(res);
                    this.$toast.fail("服务连接错误");
                  }
                })
                .catch((err) => {
                  console.log(err);
                  this.$toast.fail("服务连接错误");
                });
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
        .get("/users?id=" + this.userid)
        .then((res) => {
          if (res.statusText == "OK") {
            if (res.data.length == 0) {
              console.log(res);
            } else {
              this.user = res.data[0];
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
    },
    gohome() {
      this.$router.push({
        path: "/home",
        query: {
          id: this.userid,
        },
      });
    },
    open(url) {
      ImagePreview({
        images: [url],
        showIndex: false,
        className: "preview",
      });
    },
    show() {
      if (this.user.balance < this.activity.price) {
        this.$dialog
          .confirm({
            message: "余额不足，请先充值",
            confirmButtonText: "去充值",
          })
          .then(() => {
            this.$router.push({
              path: "/my",
              query: { id: this.userid },
            });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.$axios
          .get("/users?id=" + this.userid)
          .then((res) => {
            if (res.statusText == "OK") {
              if (res.data.length == 0) {
                console.log(res);
              } else {
                let i = false;
                this.user.balance -= this.activity.price;
                this.randomcard =
                  this.cardList[
                    Math.floor(Math.random() * this.cardList.length)
                  ];
                this.user.storehouse.forEach((item) => {
                  if (item.id == this.randomcard.id) {
                    item.num += 1;
                    i = true;
                  }
                });
                if (!i) {
                  this.user.storehouse.push({
                    id: this.randomcard.id,
                    num: 1,
                  });
                }
                this.$axios
                  .put("/users/" + this.userid, this.user)
                  .then((res) => {
                    if (res.statusText == "OK") {
                      this.visible = true;
                    } else {
                      console.log(res);
                      this.$toast.fail("抽卡失败");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    this.$toast.fail("抽卡失败");
                  });
              }
            } else {
              console.log(res);
              this.$toast.fail("抽卡失败");
            }
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fail("抽卡失败");
          });
      }
    },
  },
};
</script>

<style scoped>
.context {
  margin-top: 150px;
}
.top {
  margin-top: 15px;
}
</style>