<template>
  <v-app>
    <keep-alive include="basic">
      <router-view />
    </keep-alive>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
