<template>
  <div class="split-pane-wrap" ref='outer'>
    <div
      class="pane pane-left"
      :style="{ width: leftOffsetPercent }"
    ></div>

    <div
      class="pane pane-trigger-con"
      :style="{ width:`${triggerWidth}px`, left: triggerLeft}"
      @mousedown="handleMouseDown"
    ></div>

    <div
      class="pane pane-right"
      :style="{ left: leftOffsetPercent }"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    triggerWidth: {
      type: Number,
      default: 8
    },
    initOffset: {
      type: Number,
      default: 0.5
    },
    min: {
      type: Number,
      default: 0.1
    },
    max: {
      type: Number,
      default: 0.9
    }
  },
  data () {
    return {
      canMove: false,
      triggerOffset: 0
    }
  },
  computed: {
    leftOffsetPercent () {
      return `${this.initOffset * 100}%`
    },
    triggerLeft () {
      return `calc(${this.initOffset * 100}% - ${this.triggerWidth / 2}px) `
    }
  },
  methods: {
    handleMouseDown (e) {
      this.canMove = true
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
      this.triggerOffset = e.pageX - e.srcElement.getBoundingClientRect().left
    },
    handleMouseMove (e) {
      if (!this.canMove) return
      const bountClintRect = this.$refs['outer'].getBoundingClientRect()
      const offsetPercent = (e.pageX - this.triggerOffset + this.triggerWidth / 2 - bountClintRect.left) / bountClintRect.width
      const initOffset = offsetPercent > this.max ? this.max : offsetPercent < this.min ? this.min : offsetPercent
      this.$emit('update:initOffset', initOffset)
    },
    handleMouseUp () {
      this.canMove = false
    }
  }
}
</script>
<style lang="less">
.split-pane-wrap{
  width: 100%;
  height: 100%;
  position: relative;
  .pane {
    position: absolute;
    height: 100%;
    &-left {
      top: 0;
      background: palevioletred;
    }
    &-right {
      top:0;
      right: 0;
      bottom: 0;
      background: paleturquoise;
    }
    &-trigger-con{
      top: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(255,0,0,.6);
      user-select: none;
    }
  }
}
</style>
