<template>
  <div>
    <demo />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import demo from '../components/grammar/demo1'
export default  defineComponent ({
  name: 'home',
  components: {
    demo
  }
})

</script>
<style scoped>
</style>