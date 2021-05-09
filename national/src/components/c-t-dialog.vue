<template>
  <div>
    <el-dialog
      :title="title"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCancel"
      :width="width"
    >
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    title: {
      type:String,
      required: true
    },
    visible: {
      type:Boolean,
      default: false
    },
    width: {
      type: String,
      default: "460px"
    }
  },
  methods: {
    handleConfirm () {
      this.$emit('confirm')
    },
    handleCancel () {
      this.$emit('close')
    }
  }
}

</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #F2F2F2;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #F2F2F2;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
::v-deep .el-icon-close:before {
  color: #787878;
  font-weight: bold;
  font-size: 20px;
}
</style>