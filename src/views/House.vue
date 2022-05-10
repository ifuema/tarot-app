<template>
  <div>
    <!-- 导航栏，动态显示昵称 -->
    <van-sticky>
      <van-nav-bar :title="user.nick + '的仓库'"></van-nav-bar>
    </van-sticky>
    <!-- 当仓库为空时展示空状态提示栏 -->
    <van-empty
      :image="image"
      v-if="gridList.length == 0"
      description="仓库是空的哦，快去抽卡吧"
    />
    <!-- 当仓库不为空时展示仓库格子 -->
    <van-row
      type="flex"
      justify="center"
      class="context"
      v-for="item in gridList"
      :key="item.id"
    >
      <van-col span="23">
        <van-swipe-cell :before-close="beforeClose" :name="item.id">
          <van-card
            :thumb="item.icon"
            :num="item.num"
            @click-thumb="open(item.icon)"
          >
            <template #title>
              <div style="font-size: 16px" class="weight">
                {{ item.text }}
              </div>
            </template>
            <template #desc>
              <div class="context">{{ item.message }}</div>
            </template>
          </van-card>
          <template #right>
            <van-button
              square
              type="danger"
              text="删除"
              class="delete-button"
            />
          </template>
        </van-swipe-cell>
      </van-col>
    </van-row>
    <van-row class="context"> </van-row>
    <!-- 底部导航栏 -->
    <Tabbar :id="id" />
  </div>
</template>

<script>
import Tabbar from "../components/Tabbar.vue";
import { ImagePreview } from "vant";

export default {
  name: "House",
  components: {
    Tabbar,
  },
  data() {
    return {
      id: this.$route.query.id,
      image: require("../assets/img/custom-empty-image.png"),
      gridList: [],
      user: {},
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
              this.user = res.data[0];
              this.user.storehouse.forEach((item) => {
                this.$axios
                  .get("/cardList?id=" + item.id)
                  .then((res) => {
                    if (res.statusText == "OK") {
                      res.data[0]["num"] = item.num;
                      res.data[0].icon = require("../" + res.data[0].icon);
                      this.gridList.push(res.data[0]);
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
    open(url) {
      ImagePreview({
        images: [url],
        showIndex: false,
        className: "preview",
      });
    },
    beforeClose({ name, position, instance }) {
      switch (position) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          this.$dialog
            .confirm({
              message: "确定删除吗？",
            })
            .then(() => {
              this.user.storehouse.forEach((item, index) => {
                if (item.id == name) {
                  this.user.storehouse.splice(index, 1);
                }
              });
              this.$axios
                .put("/users/" + this.id, this.user)
                .then((res) => {
                  if (res.statusText == "OK") {
                    location.reload();
                  } else {
                    console.log(res);
                    this.$toast.fail("删除失败");
                  }
                })
                .catch((err) => {
                  console.log(err);
                  this.$toast.fail("删除失败");
                });
              instance.close();
            });
          break;
      }
    },
  },
};
</script>

<style scoped>
.weight {
  font-weight: bold;
}
.context {
  margin-top: 15px;
}
.delete-button {
  height: 100%;
}
</style>