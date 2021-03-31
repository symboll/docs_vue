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
        <v-alert type="success" >
          {{ alertText }}
        </v-alert>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "success",
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
    }
  },
  mounted() {
    this.wrap = this.$refs['wrap']
  },
  methods: {
    close () {
      // this.visible = false
      this.$emit('close')
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