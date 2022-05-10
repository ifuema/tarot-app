<template>
  <div class="body">
    <van-row type="flex" justify="end">
      <van-col span="7">
        <h2 style="color: white" @click="goreg">注册</h2>
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col span="20">
        <h1>塔罗牌</h1>
        <van-form @submit="login">
          <van-field
            v-model="username"
            name="username"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '账号不能为空' }]"
          />
          <van-field
            v-model="password"
            name="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '密码不能为空' }]"
          /><br />
          <div style="margin: 16px">
            <van-button block color="#6D72BB" native-type="submit"
              >登录</van-button
            >
          </div>
        </van-form>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    goreg() {
      this.$router.push({
        path: "/register",
      });
    },
    login(values) {
      this.$axios
        .get("/users?username=" + values.username)
        .then((res) => {
          if (res.statusText == "OK") {
            if (res.data.length == 0) {
              this.$dialog({ message: "亲爱的塔牌师，请先注册呦" });
            } else {
              if (res.data[0].password != values.password) {
                this.$dialog({ message: "密码错误了，请检查一下" });
              } else {
                this.$router.push({
                  path: "/home",
                  query: {
                    id: res.data[0].id,
                  },
                });
              }
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
  },
};
</script>

<style scoped>
.body {
  background: url(../assets/img/login_background.jpeg) no-repeat;
  background-size: auto 100%;
  height: 100%;
}
h1 {
  text-align: center;
  font-size: 55px;
  color: #e75c3e;
  margin-top: 70px;
}
h2 {
  font-size: 32px;
  margin-top: 3vw;
  text-align: right;
  margin-right: 3vw;
}
</style>