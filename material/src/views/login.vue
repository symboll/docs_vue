<template>
  <v-container>
    <v-row>
      <v-col md="4" offset="8" >
        <v-card>
          <v-tabs v-model="tab" color="primary" right @change="tabsChange">
            <v-tab>Login</v-tab>
            <v-tab>Register</v-tab>
            
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-container fluid>
                  <v-form ref="loginform" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="login.username"
                      :counter="10"
                      :rules="nameRules"
                      label="login name"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="login.password"
                      :rules="passwordRules"
                      label="password"
                      required
                      counter
                      :append-icon="lp_show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="lp_show ? 'text' : 'password'"
                      hint="At least 8 characters"
                      @click:append="lp_show = !lp_show"
                    ></v-text-field>

                    <v-btn
                      :disabled="!valid"
                      color="primary"
                      class="mr-4"
                      @click="handlerLogin"
                    >
                      Login
                    </v-btn>
                  </v-form>
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container fluid>
                  <v-form ref="registerform" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="register.email"
                      :rules="emailRules"
                      label="e-mail"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="register.username"
                      :counter="10"
                      :rules="nameRules"
                      label="username"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="register.password"
                      :rules="passwordRules"
                      label="password"
                      required
                      counter
                      :append-icon="rp_show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="rp_show ? 'text' : 'password'"
                      hint="At least 8 characters"
                      @click:append="rp_show = !rp_show"
                    ></v-text-field>

                    <v-btn
                      :disabled="!valid"
                      color="primary"
                      class="mr-4"
                      @click="handlerRegister"
                    >
                      Register
                    </v-btn>
                  </v-form>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <alert 
      :type="alertType"
      :visible="visible"
      :alertText="alertText"
      @close="visible = false"
    />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import Alert from '@/components/alert.vue'
export default {
  data: () => ({
    valid: true,
    login: {
      username: '',
      password: ''
    },
    register: {
      username: '',
      password: '',
      email: ''
    },
    lp_show: false,
    rp_show: false,
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    passwordRules: [
      v => !!v || 'password is required',
      v => (v && v.length >= 6) || 'Password must be more than 6 characters'
    ],
    visible: false,
    alertType: "",
    alertText: "",
    tab: null
  }),

  computed: {

  },
  components: {
    Alert
  },
  methods: {
    ...mapActions([
      'loginAction',
      'registerAction'
    ]),
    message (alertType, alertText) {
      this.visible = true
      this.alertType = alertType
      this.alertText = alertText
      setTimeout(()=> {
        this.visible = false
      }, 2000)
    },
    handlerLogin () {
      if(this.$refs.loginform.validate()){
        const { username, password } = this.login
        this.loginAction({ username, password }).then(res => {
          this.$router.push({ name: 'home' })
        }).catch(err => {
          this.message('error', `Error: ${err.message}`)
        })
      }
    },
    handlerRegister () {
      if(this.$refs.registerform.validate()){
        const { username, password, email} = this.register
        this.registerAction({ username, password, email })
          .then(_ => {
            this.message('success', 'Register success, Welcome to login!')
            this.tab = 0
          })
          .catch(err => {
            this.message('error', `Error: ${err.message}`)
          })
      }
    },
    tabsChange (e) {
      console.log('tab==>',this.tab)
      if (e === 0 && !this.$refs.registerform) return
      switch (e) {
        case 0:
          this.$refs.registerform.reset()
          break
        case 1:
          this.$refs.loginform.reset()
          break
      }
    },
  }
}
</script>
<style lang='scss' scoped>
</style>
