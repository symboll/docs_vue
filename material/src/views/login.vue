<template>
  <v-container>
    <v-row>
      <v-col md="4" offset="8" >
        <v-card>
          <v-tabs color="deep-purple accent-4" right @change="tabsChange">
            <v-tab>Login</v-tab>
            <v-tab>Register</v-tab>

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
                    color="success"
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
                    color="success"
                    class="mr-4"
                    @click="handlerRegister"
                  >
                    Register
                  </v-btn>
                </v-form>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
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
    ]
  }),

  computed: {

  },
  methods: {
    ...mapActions([
      'loginAction'
    ]),
    handlerLogin () {
      this.$refs.loginform.validate()
      const { username, password } = this.login
      this.loginAction({ username, password }).then(res => {
        this.$router.push({ name: 'home' })
      }).catch(err => {
        console.log('err==>', err)
      })
    },
    handlerRegister () {
      this.$refs.registerform.validate()
      // console.log('register', this.register)
    },
    tabsChange (e) {
      if (e === 0 && !this.$refs.registerform) return
      switch (e) {
        case 0:
          this.$refs.registerform.reset()
          break
        case 1:
          this.$refs.loginform.reset()
          break
      }
    }
  }
}
</script>
<style scoped></style>
