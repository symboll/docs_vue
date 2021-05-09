<template>
  <div>
    <template v-for="item in organList">
      <el-submenu 
        v-if="item.children && item.children.length > 0"
        :key="item.id" 
        :index="item.id"
      >
        <span slot="title">{{ item.name }}</span>
        <organ-item  :organList="item.children" />
      </el-submenu>
      <el-menu-item  
        v-else
        :key="item.id"
        :index="item.id"
      >
        <span slot="title">{{ item.name  }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "organItem",
  props: {
    organList: {
      type: Array,
      default: ()=> []
    }
  },
};
</script>
<style lang='scss' scoped>
</style>