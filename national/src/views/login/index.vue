<template>
  <div class="login_wrap">
    <div class="login_title">国保基础防控系统</div>
    <div class="login_card">
      <div class="login_form">
        <div class="login_form_title">
          <span class="login_form_title_icon"></span>
          <span>欢迎登陆</span>
        </div>
        <div class="login_form_error">
          <span v-if="isError">账号或密码输入错误</span>
        </div>
        <div class="login_form_label">账号</div>
        <div class="login_form_input">
          <input type="text" v-model="form.accountName">
        </div>
        <div class="login_form_label">密码</div>
        <div class="login_form_input">
          <input type="password" v-model="form.password">
        </div>
        <div class="login_form_button" @click="handleSubmit">登陆</div>
      </div>
    </div>
    <div class="login_foot">
      <div>技术支持 : 某某某某公司</div>
      <div>联系电话 : 18101010202</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      isError: false,
      form: {
        accountName: "",
        password: ""
      }
    }
  },
  methods: {
    ...mapActions([
      'LoginAction'
    ]),
    handleSubmit () {
      const { accountName, password } = this.form
      this.LoginAction({ accountName, password  }).then(_ => {
        this.$router.push({ name: "Home" })
      }).catch(_ => this.isError = true);
    }
  }
}

</script>
<style lang="scss" scoped>
.login_wrap{
  width: 100vw;
  height: 100vh;
  min-height: 900px;
  background-image: url('../../assets/image/img_bg@3x.png');
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .login_title{
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
    margin: 24px 0 0 24px;
    font-family: 'MicrosoftYaHei-Bold';
  }
  .login_card{
    align-self: center;
    width: 87.07%;
    min-width: 1219px;
    min-height: 710px;
    background-image: url('../../assets/image/img_bg_card@3x.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select:none;
    .login_form{
      margin-right: 144px;
      width: 354px;
      height: 320px;
      // background-color: #efefef;
      display: flex;
      flex-direction: column;
      &_title {
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3D95F6;
        font-size: 18px;
        font-family: 'MicrosoftYaHei-Bold';
        font-weight: bold;
        // margin-bottom: 38px;
        &_icon{
          height: 24px;
          width: 24px;
          margin-right: 16px;
          background-image: url('../../assets/image/聊天欢迎语.png')
        }
      }
      &_error {
        margin-top: 21px;
        margin-bottom: -4px;
        height: 21px;
        color: #CE0D0D;
        font-family: 'MicrosoftYaHei';
        font-size: 16px;
      }
      &_label {
        margin-top: 16px;
        margin-bottom: 12px;
        height: 21px;
        font-size: 16px;
        color: #333;
        
      }
      &_input {
        width: 100%;
        height: 40px;
        input {
          width: 100%;
          height: 100%;
          outline: none;
          border: none;
          background:  #F2F2F2;
          border-radius: 8px;
          padding-left: 16px;
        }
      }
      &_button {
        margin-top:40px;
        width: 100%;
        height: 40px;
        border-radius: 8px;
        background-image: url('../../assets/image/ic_jk_dl@3x.png');
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 16px;
        font-family: 'MicrosoftYaHei-Bold';
        font-weight: bold;
      }
    }
  }
  .login_foot{
    color: #ffffff;
    font-size: 16px;
    margin: 0 0 24px 24px;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
}
</style>