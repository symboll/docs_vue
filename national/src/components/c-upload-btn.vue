<template>
  <div class="c_upload_btn_wrap">
    <div v-show="imageLth < 5">
      <img :src="require('@/assets/icons/ic_tjzp@3x.png')" alt="" />
      <input type="file" @change="handleChange($event, 'image')">
    </div>
    <div v-show="videoLth < 1">
      <img :src="require('@/assets/icons/ic_tjsp@3x.png')" alt="" />
      <input type="file" @change="handleChange($event,'video')">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageLth:{
      type: Number,
      default:0
    },
    videoLth: {
      type: Number,
      default:0
    }
  },
  methods: {
    handleChange (event, type) {
      this.$emit('change', {
        event,type
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.c_upload_btn_wrap{
  display: flex;
  > div {
    cursor: pointer;
    width: 80px;
    height: 80px;
    position: relative;
    > img {
      width: 100%;
      height: 100%;
    }
    > input {
      width: 100px !important;
      height: 100px;
      color: transparent;
      position: absolute;
      left: 0;
      opacity: 0;
      z-index: 100;
    }
  }
  > div:nth-child(1) {
    margin-right: 20px;
  }
}
</style>
