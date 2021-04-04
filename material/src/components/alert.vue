<template>
  <div>
    <div ref="wrap" class="wrap"></div>
    <v-dialog  
      transition="dialog-top-transition"
      v-model="visible" 
      max-width="400px" 
      @click:outside="close"
      hide-overlay
      :attach="wrap"
      >
      <v-card>
        <v-alert :type="type" >
          {{ alertText }}
        </v-alert>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "alert",
  data: ()=> ({
    wrap: null
  }),
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    alertText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    },
    delay: {
      type: Number,
      default: 2000
    }
  },
  mounted() {
    this.wrap = this.$refs['wrap']
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    }
  },
  watch: {
    visible (newVal, oldVal) {
      const _this = this
      if(newVal === true) {
        setTimeout(()=> {
          _this.close()
        }, _this.delay)
      }
    }
  }

}

</script>
<style lang="scss" scoped>
::v-deep .v-dialog {
  box-shadow: none !important;
}
.wrap .v-dialog__content{
  align-items: start !important;
}
</style>