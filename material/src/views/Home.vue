<template>
  <div class="home">
    home
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {

  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      // role().then(res => {
      //   console.log('res==>', res)
      // })
    }
  }

}
</script>

<style scoped>
.home {
  background: red;
}
</style>
