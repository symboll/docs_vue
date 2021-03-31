<template>
  <v-card >
    <v-tabs
      v-model="tab"
      left
    >
      <v-tab
        v-for="item in items"
        :key="item"
      >
        <h4>{{ item }}</h4>
      </v-tab>
    </v-tabs>
    <div class="h10"></div>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-file-input
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            label="Avatar"
            @change="handleChange"
          ></v-file-input>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <user />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <role  />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <auth-code />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>


<script>
import { mapActions } from 'vuex'
import AuthCode from './authcode'
import Role from './role'
import User from './user'
export default {
  name: "basic",
  data: () =>({
    tab: null,
    items: [
      '基本设置',
      '用户',
      '角色',
      '权限码'
    ],
    rules: [
      value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
    ],
  }),
  components: {
    AuthCode,
    Role,
    User
  },
    mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'getAuthCodeAction',
      'getRoleAction',
      'getUserListAction'
    ]),
    init () {
      const p = this.getAuthCodeAction()
      const q = this.getRoleAction()
      const r = this.getUserListAction()
      Promise.allSettled([p, q, r]).then(res => {
        console.log('res',res)
      }).catch(err => { console.log('err ',err) })
    },
    handleChange (e){
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.h10{
  height: 10px;
}
</style>
