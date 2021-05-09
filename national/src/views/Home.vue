<template>
  <div class="home">
    name: {{ name }}
    <el-button type="primary" @click="handleClick">按钮</el-button>

  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex'
export default {
  name: 'Home',
  data() {
    return {
      list: []
    }
  },
  mounted() {

  },
  computed: {
    ...mapState({
      name: state => state.name
    })
  },
  methods: {
    ...mapActions([
      'getUserListAction',
    ]),
    handleClick () {
      this.getUserListAction()
    }
  },

}
</script>
<style lang="scss" scoped>

</style>
