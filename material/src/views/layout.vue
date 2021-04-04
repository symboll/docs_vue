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
      <v-avatar
        color="accent"
        size="32"
      >
        <img
          v-if="avatar && avatar !== ''"
          alt="Avatar"
          :src="avatar"
        >
        <span v-else>{{ username.slice(0,1) }}</span>
      </v-avatar>
      <v-btn text class="btn_username">
        {{ username }}
      </v-btn>
      <v-btn
        text
        outlined
        @click="logout"
      >
        <span class="mr-2">login out</span>
        <v-icon>mdi-power</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app fixed class="navigation_drwaer">
      <v-card class="mx-auto" max-width="300" tile>
        <v-list shaped>
          <!-- <v-subheader>REPORTS</v-subheader> -->
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
      <keep-alive>
        <router-view include='basic'/>
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      selectedItem: 0,
      items: [
        { text: '首页', icon: 'mdi-home', path: 'home' },
        { text: '基本设置', icon: 'mdi-account', path: 'basic' },
        { text: 'About', icon: 'mdi-account', path: 'about' }
      ]
    }
  },
  mounted() {
    const name = this.$route.name
    const index = this.items.findIndex(i => i.path === name)
    this.selectedItem = index
  },
  computed: {
    ...mapState({
      username: state => state.user.username,
      avatar: state => state.user.avatar
    })
  },
  methods: {    
    ...mapActions([
      'logoutAction'
    ]),
    handleClick (e) {
      if(this.$route.name == e.path) {return}
      this.$router.push(e.path)
    },
    logout () {
      this.logoutAction()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="scss" scoped>
.v-main__wrap {
  >div{
    padding: 6px;
  }
}
.app_bar{
  left: 0px !important;
}
.navigation_drwaer{
  top: 64px !important;
}
.v-btn.btn_username{
  text-transform: none;
}
</style>
