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
    <v-tabs-items v-model="tab" >
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

    <alert 
      :type="alertType"
      :visible="alertVisible"
      :alertText="alertText"
      @close="alertVisible = false"
    />
  </v-card>
</template>


<script>
import { mapActions } from 'vuex'
import AuthCode from './components/authcode'
import Role from './components/role'
import User from './components/user'
import Alert from '@/components/alert.vue'
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
    alertVisible: false,
    alertType: '',
    alertText: ''
  }),
  components: {
    AuthCode,
    Role,
    User,
    Alert
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'getAuthCodeAction',
      'getRoleAction',
      'getUserListAction',
      "upLoadAction"
    ]),
    message (alertType, alertText) {
      this.alertVisible = true
      this.alertType = alertType
      this.alertText = alertText
      setTimeout(()=> {
        this.alertVisible = false
      }, 2000)
    },
    init () {
      const p = this.getAuthCodeAction()
      const q = this.getRoleAction()
      const r = this.getUserListAction()
      Promise.all([p, q, r]).then(res => {
        console.log('res',res)
      }).catch(err => {
        console.log('err-->', err)
        this.message('error', `Error: ${err.message}`)
      })
    },
    handleChange (e){
      const formData = new FormData()
      formData.append('file', e,  e.name)

      this.upLoadAction(formData).then(res => {
        console.log('res++', res)
      })
        .catch(err => this.message('error', `Error: ${err.message}`))
     
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
