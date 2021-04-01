<template>
  <div>home</div>
</template>

<script>

export default {
  name: "home",
  mounted() {
    console.log('home mounted')
  },
  activated() {
    console.log('home activated')
  },
  deactivated() {
    console.log('home dactivated')
  },
  methods: {

  }
  
}

</script>
<style scoped>
</style>
