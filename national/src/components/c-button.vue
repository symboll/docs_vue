<template>
  <div>
    <el-button 
      @click="handleClick"
      :round="round"
      :disabled="disabled"
      :loading="loading"
      :type="type"
      :class="{
        'c_button': true,
        'c_flat': flat,
        'c_icon': icon,
        'c_loading':loading
      }"
    >
      <img v-if="!loading" 
        :class="{
          'c_rotate': rotate
        }" 
        :src="require(`@/assets/icons/${iconType}@3x.png`)" alt=""
      >
      <slot></slot>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'c-button',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    round: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    flat: {
      type: Boolean,
      default: false
    },
    icon:  {
      type: Boolean,
      default: false
    },
    iconType: {
      type: String,
      required: true
    },
    rotate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  },
}

</script>
<style lang="scss" scoped>
.c_button{
  color: #ffffff;
  padding: 7px 16px;
  ::v-deep span {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 12px;
      width: 12px;
    }
    span {
      margin-left: 10px;
    }
  }
}
.c_flat{
  padding: 4px 10px;
}
.c_icon {
  padding: 8px;
  ::v-deep span {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 18px;
      width: 18px;
    }
  }
}

::v-deep .c_loading{
  display: flex;
  > span{
    margin-left: 0px;
  }
}

.c_rotate {
  animation: rotates .3s ease-in;
}
@keyframes rotates {
  0% { 
    transform: rotate(0deg);
  }
  100% { 
    transform: rotate(360deg);
  }
}
</style>