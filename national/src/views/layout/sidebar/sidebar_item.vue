<template>
  <div>
    <template v-for="item in routes">
      <el-submenu 
        v-if="item.children && item.children.length > 0 && (currentUser.authCodeList || []).includes(item.name)"
        :key="item.path" 
        :index="item.path"
      >
        <span slot="title">
          <img class="c_icon_left" v-if="item.meta&& item.meta.icon" :src="item.meta.icon" alt="">
          {{ item.meta? item.meta.title: "" }}</span>
        <sidebar-item 
          :routes="item.children"
          :prefix="item.path"
        />
      </el-submenu>
      <el-menu-item  
        v-else-if="item.meta && !item.meta.hide && (currentUser.authCodeList || []).includes(item.name)"
        :key="item.path"
        :index="prefix === '' ? item.path: prefix +'/'+ item.path"
      > 
        <img class="c_icon_left" v-if="item.meta&& item.meta.icon" :src="item.meta.icon" alt="">
        <span slot="title">{{ item.meta? item.meta.title: "" }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { constants } from 'fs';
export default {
  name: "SidebarItem",
  props: {
    routes: {
      type: Array,
      default: ()=> []
    },
    prefix: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-menu-item.is-active ,
::v-deep .el-menu-item:hover,
::v-deep .el-submenu__title:hover{
  color: #ffffff;
  font-weight: bold;
  background-color: rgb(20,98,204) !important;
  // background-image: linear-gradient(to right, rgb(20,98,204), gold, rgb(20,98,204) );
}
::v-deep .el-submenu__title i {
  color: #ffffff;
}

.c_icon_left{
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
</style>
