<template>
  <div>
    <div class="c_wrap">
      <div class="user_card">
        <div class="user_card_button">
          <div class="translate">
            <div class="avatar" >
              <div v-if="currentUser && currentUser.head" 
                :style="{ backgroundImage: `url(${currentUser.head})`}"></div>
            </div>
            <el-button icon="el-icon-lock" type="primary" @click="modifyPasswrod">修改密码</el-button>
          </div>
        </div>
        <div class="user_card_info">
          <div><div>账 号</div><div>{{ currentUser.accountName }}</div> </div>
          <div><div>警 号</div><div>{{ currentUser.id }}</div></div>
          <div><div>所属角色</div><div>
            <span v-for="item in currentUser.roleNames" :key="item">{{item}}</span>
          </div></div>
          <div><div>所属组织</div><div>{{ currentUser.orgName }}</div></div>
        </div>
      </div>
    </div>
    <c-t-dialog
      :visible="visible"
      title="修改密码"
      @close="handleClose"
      @confirm="handleConfirm"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
    </c-t-dialog>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex'
import { setToken } from '@/lib/util.js'
import md5 from 'md5'
export default {
  data() {
    return{
      visible: false,
      form: {
        oldPwd:'',
        password: ""
      },
      rules: {
        oldPwd: [{required: true, message: "请输入旧密码"}],
        password: [{required: true, message: "请输入新密码"}],
      }
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser || {}
    })
  },
  methods: {
    ...mapActions([
      'modifyPasswordApi'
    ]),
    modifyPasswrod () {
      this.visible= true
    },
    handleClose () {
      this.visible = false
    },
    handleConfirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.modifyPasswordApi({
            // ...this.form,
            oldPwd: md5(this.form.oldPwd).toUpperCase(),
            password: md5(this.form.password).toUpperCase(),
            id: this.currentUser.id
          }).then(res => {
            this.$message.success('修改成功!')
            this.handleClose()
            setToken()
            this.$router.push({ name: 'login' })
          })
        }else {
          return false
        }
      })
    }
  },

}
</script>
<style lang='scss' scoped>
.c_wrap {
  display: flex;
  height: calc(100vh - 68px);
  align-items: center;
  justify-content: center;
  .user_card {
    width: 560px;
    height: 276px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0,.1);
    border-radius: 4px;
    display: flex;
    &_button {
      height: 100%;
      flex-basis: 274px;
      flex-shrink: 0;
      .translate {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translateY(-100px);
        .avatar {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0,.1);
          background-size: 100% 100%;
          width: 144px;
          height: 144px;
          border-radius: 50%;
          background-image: url('../../assets/image/img_morentx@3x.png');
          > div {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-size: 100% 100%;
          }
        }
        .el-button {
          margin-top: 49px;
          width: 108px;
          height: 34px;
        }
      }
    }
    &_info {
      flex: 1;
      box-sizing: border-box;
      padding-top: 70px;
      padding-bottom: 70px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      > div{
        display: flex;
        align-items: center;
        
        > div:nth-child(1) {
          text-align: right;
          padding-right: 10px;
          width: 70px;
          flex-shrink: 0;
        }
      }
      >div:nth-child(3) {
        >div:nth-child(2) {
          display: flex;
          flex-wrap: wrap;
          span {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>