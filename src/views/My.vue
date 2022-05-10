<template>
  <div>
    <!-- 导航栏 -->
    <van-sticky>
      <van-nav-bar title="我的"></van-nav-bar>
    </van-sticky>
    <!-- 头像、昵称展示 -->
    <van-skeleton avatar-size="14vw" title avatar :row="15" :loading="loading">
      <van-row type="flex" class="context">
        <van-col span="3" offset="1">
          <div class="head">{{ nickOne }}</div>
        </van-col>
        <van-col span="19" offset="1">
          <div class="title" style="display: inline-block">{{ user.nick }}</div>
          &nbsp;&nbsp;
          <van-icon name="edit" @click="updatenickshow()" />
        </van-col>
      </van-row>
      <!-- 金币信息、充值 -->
      <van-row type="flex" justify="center" class="context">
        <van-col span="22">
          <van-icon name="diamond" size="20px" color="#EE934C" />
          <span class="weight">金币信息</span>
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="top">
        <van-col span="23">
          <van-cell title="金币" :value="user.balance" />
          <van-field
            v-model="sms"
            center
            clearable
            label="金币充值"
            placeholder="输入充值金额"
            :formatter="formatter"
          >
            <template #button>
              <van-button size="small" type="primary" @click="updatebalance()"
                >充值</van-button
              >
            </template>
          </van-field>
        </van-col>
      </van-row>
      <!-- 个人信息、修改 -->
      <van-row type="flex" justify="center" class="context">
        <van-col span="22">
          <van-icon name="label" size="20px" color="#2CBDDC" />
          <span class="weight">基础信息</span>
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="top">
        <van-col span="23">
          <van-cell
            title="性别"
            is-link
            :value="user.gender"
            @click="showGenderPicker = true"
          />
          <van-popup v-model="showGenderPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="genderColumns"
              @cancel="showGenderPicker = false"
              @confirm="onGenderConfirm"
            />
          </van-popup>
          <van-cell
            title="生日"
            is-link
            :value="user.birthday"
            @click="showBirthdayPicker = true"
          />
          <van-popup v-model="showBirthdayPicker" position="bottom">
            <van-datetime-picker
              title="请选择生日"
              type="date"
              @confirm="onBirthdayConfirm"
              @cancel="showBirthdayPicker = false"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>
        </van-col>
      </van-row>
      <!-- 库存信息展示列表 -->
      <van-row type="flex" justify="center" class="context">
        <van-col span="22">
          <van-icon name="goods-collect" size="20px" color="#609D7D" />
          <span class="weight">仓库信息</span>
        </van-col>
      </van-row>
      <van-row type="flex" justify="center" class="top">
        <van-col span="23">
          <van-cell title="已拥有卡牌种类" :value="storehouseTypeNum + '种'" />
          <van-cell title="已拥有卡牌总量" :value="storehouseNum + '张'" />
        </van-col>
      </van-row>
      <!-- 退出登录按钮 -->
      <van-row type="flex" justify="center" class="context">
        <van-col span="21">
          <van-button
            color="red"
            plain
            size="large"
            class="top"
            @click="logout()"
            >退出登录</van-button
          >
        </van-col>
      </van-row>
      <van-row class="top"> </van-row>
    </van-skeleton>
    <!-- 修改昵称弹出框 -->
    <van-dialog
      v-model="show"
      title="修改昵称"
      show-cancel-button
      @confirm="updatenick()"
    >
      <van-field v-model="nick" placeholder="请输入昵称" />
    </van-dialog>
    <Tabbar :id="id" />
  </div>
</template>

<script>
import Tabbar from "../components/Tabbar.vue";

export default {
  name: "My",
  components: {
    Tabbar,
  },
  data() {
    return {
      id: this.$route.query.id,
      loading: true,
      user: {},
      show: false,
      nick: "",
      spacePattern: /^\S*$/,
      nickPattern: /^.{0,4}$/,
      sms: "",
      nickOne: "",
      showGenderPicker: false,
      genderColumns: ["男", "女", "其他"],
      showBirthdayPicker: false,
      minDate: new Date(1973, 0, 1),
      maxDate: new Date(),
      storehouseNum: 0,
      storehouseTypeNum: 0,
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
              this.storehouseTypeNum = res.data[0].storehouse.length;
              this.getStorehouseNum();
              this.loading = false;
              this.getNickOne();
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
    updatenickshow() {
      this.show = true;
    },
    updatenick() {
      if (this.nick != "") {
        if (this.spacePattern.test(this.nick)) {
          if (this.nickPattern.test(this.nick)) {
            this.user.nick = this.nick;
            this.updateuser();
            this.getNickOne();
          } else {
            this.$toast.fail("昵称不能超过4个字符");
          }
        } else {
          this.$toast.fail("昵称不能包含空格");
        }
      } else {
        this.$toast.fail("昵称不能为空");
      }
    },
    updatebalance() {
      if (this.sms != "") {
        this.user.balance += parseInt(this.sms);
        this.updateuser();
        this.sms = "";
      } else {
        this.$toast.fail("请输入充值金额");
      }
    },
    updateuser() {
      this.$axios
        .put("/users/" + this.id, this.user)
        .then((res) => {
          if (res.statusText == "OK") {
            this.$toast.success("成功");
          } else {
            console.log(res);
            this.$toast.fail("失败");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("失败");
        });
    },
    formatter(value) {
      return value.replace(/\D/g, "");
    },
    getNickOne() {
      this.nickOne = this.user.nick.substr(0, 1);
    },
    onGenderConfirm(value) {
      if (value == "男") {
        this.user.gender = "公子";
      } else if (value == "女") {
        this.user.gender = "小姐";
      } else {
        this.user.gender = value;
      }
      this.updateuser();
      this.showGenderPicker = false;
    },
    onBirthdayConfirm(date) {
      this.user.birthday = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`;
      this.updateuser();
      this.showBirthdayPicker = false;
    },
    getStorehouseNum() {
      let num = 0;
      for (let i = 0; i < this.user.storehouse.length; i++) {
        num += this.user.storehouse[i].num;
      }
      this.storehouseNum = num;
    },
    logout() {
      this.$dialog
        .confirm({
          message: "是否退出登录？",
        })
        .then(() => {
          this.$router.push({
            path: "/",
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style scoped>
.head {
  background-color: #1e9eb3;
  height: 0;
  padding-bottom: 100%;
  font-size: 9.5vw;
  text-align: center;
  border-radius: 50%;
  color: white;
}
.context {
  margin-top: 40px;
}
.top {
  margin-top: 15px;
}
.title {
  font-size: 7vw;
  font-weight: bold;
  margin-top: 1.5vw;
}
.weight {
  font-weight: bold;
}
</style>