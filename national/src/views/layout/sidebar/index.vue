<template>
  <div class="side_bar">
    <div class="side_bar_title">
      <div class="title_text">国保基础防控</div>
      <div class="title_logo"></div>
    </div>
    <el-scrollbar  wrap-class="scrollbar-wrapper">
      <el-menu 
        :unique-opened="true"
        router
        text-color="#ffffff"
        :default-active="route"
      >
        <side-bar-item :routes="routes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SideBarItem from './sidebar_item'
export default {
  components: {
    SideBarItem
  },
  data() {
    return {
      isCollapse: false,
      route: this.$route.fullPath,
      routes: this.$router.options.routes[0].children
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}

</script>
<style lang='scss' scoped>
.side_bar{
  height: 100vh;
  border-right: 1px solid #e6e6e6;
  background-image: linear-gradient(to right, #197AFF, #004FE0);
  &_title {
    height: 144px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title_text {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 8px 0;
      user-select: none;
      color: #ffffff;
      font: {
        size: 20px;
        weight: bold;
        family: 'MicrosoftYaHei-Bold';
      }
    }
    .title_logo{
      width: 88px;
      height: 88px;
      margin: 8px 0;
      background-image: url('../../../assets/icons/国保APP应用图标@3x.png');
      background-size: 100% 100%;
    }
  }
}

::v-deep .el-menu {
  border-right: none;
  background-image: linear-gradient(to right, #197AFF, #004FE0) !important;
}
</style>