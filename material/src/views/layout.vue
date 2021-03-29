<template>
  <v-app>
    <v-app-bar app color="primary" dark class="app_bar">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app fixed class="navigation_drwaer">
      <v-card class="mx-auto" max-width="300" tile>
        <v-list shaped>
          <v-subheader>REPORTS</v-subheader>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              @click="handleClick(item)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-navigation-drawer>
    <v-main class="main_p10">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      selectedItem: 0,
      items: [
        { text: '基本设置', icon: 'mdi-account', path: 'basic' },
        { text: 'Home', icon: 'mdi-clock', path: 'home' },
        { text: 'About', icon: 'mdi-account', path: 'about' }
      ]
    }
  },
  watch: {
    '$route' (value) {
      const name = value.name
      const index = this.items.findIndex(item => item.path === name)
      this.selectedItem = index
    }
  },
  methods: {
    handleClick (e) {
      console.log(e)
      this.$router.push(e.path)
    }
  }
}
</script>
<style lang="scss" scoped>

 .v-main__wrap {
    >div{
      padding: 10px;
    }
  }

.app_bar{
  left: 0px !important;
}
.navigation_drwaer{
  top: 64px !important;
}

</style>
