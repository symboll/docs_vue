<template>
  <div>
    <c-t-dialog
      :title="title"
      :visible="visible"
      :width="width"
      @confirm="confirm"
      @close="close"
    >
      <section class="dialog_body">
        <div class="img">
          <img :src="require('@/assets/icons/ic_tanc_xunwen@3x.png')" alt="">
        </div>
        <div class="text">
          <div>{{ context }}</div>
          <div class="subtitle">{{ subtitle }}</div>
        </div>
      </section>
    </c-t-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    visible: {
      type:Boolean,
      default: false
    },
    title: {
      type:String,
      default: '删除',
    },
    context: {
      type: String,
      default: '确认删除吗?'
    },
    subtitle: {
      type: String,
      default: '删除后不能撤回，请确认'
    },
    width: {
      type: String,
      default: "460px"
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    close () {
      this.$emit('close')
    }
  }
}

</script>
<style lang="scss" scoped>
.dialog_body {
  display: flex;
  align-items: center;
  height: 110px;
  .img {
    width: 64px;
    height: 64px;
    margin: 0 30px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .text {
    color: #303133;
    font-weight: bold;
    font-size: 16px;
  }
  .subtitle {
    color: #606266;
    font-weight: 400;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>