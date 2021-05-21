<template>
  <div class="header_wrap">
    <div class="user_info">
      <el-dropdown @command="handleCommand" trigger="click" >
        <span class="el-dropdown-link">
          {{ currentUser.username ?  currentUser.username : '个人中心' }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
          <el-dropdown-item command="userInfo" icon="el-icon-user">个人信息</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { setToken } from '../../lib/util.js'
export default {
  name: "appHeader",
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser || {}
    })
  },
  methods: {
    ...mapMutations([
      'SET'
    ]),
    handleCommand (event) {
      switch(event) {
        case 'logout': {
          setToken('')
          this.SET({ module: "user", key: "currentUser", value: {} })
          this.$router.push({
            name: 'login'
          })
          break;
        }
        case 'userInfo': {
          this.$router.push({
            name: 'person'
          })
          break;
        }
      }
    }
  },
}

</script>
<style lang="scss" scoped>
.header_wrap {
  height: 100%;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .user_info {
    margin-right: 30px;
    .el-dropdown-link {
      cursor: pointer;
      font-size: 16px;
    }
  }
}

::v-deep .el-dropdown-menu__item{
  line-height: 40px !important;
  font-size: 14px !important;
}
</style>