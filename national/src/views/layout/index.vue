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
import { mapActions } from 'vuex'
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
      'getUserInfoAction',
      'getRoutersAction'
    ])
  },
  mounted() {
    // this.getUserInfoAction()
    // this.getRoutersAction()
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
