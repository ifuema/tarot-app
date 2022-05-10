<template>
  <div class="body">
    <van-row type="flex" justify="end">
      <van-col span="7">
        <h2 style="color: white" @click="gologin">登录</h2>
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col span="20">
        <h1>塔牌师</h1>
        <van-form @submit="register">
          <van-field
            required
            v-model="username"
            name="username"
            label="账号"
            placeholder="请输入账号"
            :rules="[
              { required: true, message: '账号不能为空' },
              { pattern: spacePattern, message: '不能包含空字符' },
            ]"
          />
          <van-field
            required
            v-model="nick"
            name="nick"
            label="昵称"
            placeholder="请输入昵称"
            :rules="[
              { required: true, message: '昵称不能为空' },
              { pattern: spacePattern, message: '不能包含空字符' },
              { pattern: nickPattern, message: '不能超过最大长度4字符' },
            ]"
          />
          <van-field name="gender" label="性别">
            <template #input>
              <van-radio-group v-model="gender" direction="horizontal">
                <van-radio name="公子">男</van-radio>
                <van-radio name="小姐">女</van-radio>
                <van-radio name="其他">其他</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            readonly
            clickable
            name="birthday"
            :value="birthday"
            label="生日"
            placeholder="点击选择生日"
            @click="showPicker = true"
          />
          <van-popup v-model="showPicker" position="bottom">
            <van-datetime-picker
              title="请选择生日"
              type="date"
              @confirm="onConfirm"
              @cancel="showPicker = false"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>
          <van-field
            required
            v-model="password"
            name="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[
              { required: true, message: '密码不能为空' },
              { pattern: spacePattern, message: '不能包含空字符' },
            ]"
          />
          <van-field
            required
            v-model="password1"
            name="password1"
            type="password"
            label="确认密码"
            placeholder="请确认密码"
          /><br />
          <div style="margin: 16px">
            <van-button block color="#6D72BB" native-type="submit"
              >注册</van-button
            >
          </div>
        </van-form>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      password1: "",
      birthday: "",
      gender: "",
      nick: "",
      spacePattern: /^\S*$/,
      nickPattern: /^.{0,4}$/,
      showPicker: false,
      minDate: new Date(1973, 0, 1),
      maxDate: new Date(),
    };
  },
  methods: {
    gologin() {
      this.$router.push({
        path: "/",
      });
    },
    onConfirm(date) {
      this.birthday = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`;
      this.showPicker = false;
    },
    register(values) {
      if (values.password != values.password1) {
        this.$toast("两次密码不一致");
      } else {
        this.$axios
          .get("/users?username=" + values.username)
          .then((res) => {
            if (res.statusText == "OK") {
              if (res.data.length == 0) {
                if (values.gender == "") {
                  values.gender = "未知";
                }
                if (values.birthday == "") {
                  values.birthday = "未知";
                }
                let data = {
                  username: values.username,
                  password: values.password,
                  storehouse: [],
                  birthday: values.birthday,
                  gender: values.gender,
                  nick: values.nick,
                  balance: 25,
                };
                this.$axios
                  .post("/users", data)
                  .then((res) => {
                    if (res.statusText == "Created") {
                      this.$dialog
                        .alert({
                          title: "注册成功",
                          message: "恭喜成为塔牌师，请前往登录",
                        })
                        .then(() => {
                          this.$router.push({
                            path: "/",
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
              } else {
                this.$dialog({ message: "该塔牌师已存在" });
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
      }
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
  margin-top: 3vw;
  font-size: 32px;
  text-align: right;
  margin-right: 3vw;
}
</style>