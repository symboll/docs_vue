<template>
  <div class="c_wrap ">
    <header class="c_header">
      <div @click="handleBack" class="back">
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <el-button type="primary" class="c_btn" round @click="handleEdit">
        编辑
      </el-button>
    </header>

  </div>
</template>

<script>
export default {

  methods: {
    handleBack () {
      this.$router.go(-1)
    },
    handleEdit () {
      const id = this.$route.query.id
      console.log(id)
      // this.getPoliceListAction(row.orgId)
      this.$router.push({ 
        name: "InfoOfficerEdit",
        query: { id }
      })
    }

  },
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom_c_info.scss';
  /* @import '@/assets/style/file_upload_button.scss'; */
</style>