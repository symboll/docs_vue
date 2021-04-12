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
          <v-row>
            <v-col cols="3" md="3" class="avatar_wrap">
              <v-avatar
                color="accent"
                size="128"
              >
                <img
                  v-if="avatar && avatar !== ''"
                  alt="Avatar"
                  :src="avatar"
                >
                <span v-else>{{ username.slice(0,1) }}</span>
              </v-avatar>
                <v-file-input
                  
                  class="file_upload"
                  outlined
                  dense
                  @change="handleChange"
                ></v-file-input>
            </v-col>
            <v-col cols="4" md="4" >
              <template v-for="item in basicUserinfo" >
                <basic-info-edit
                  :key="item.label"

                  :disabled="item.disabled"
                  :label="item.label"
                  :type="item.type"
                  :options="item.options"
                />
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" md="2" offset="6">
              <v-btn color="primary" @click="handleSubmit">更新</v-btn>
            </v-col>
          </v-row>
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
      :visible.sync="alertVisible"
      :alertText="alertText"
      :delay="delayTime"
    />
  </v-card>
</template>


<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import AuthCode from './components/auth_code'
import Role from './components/role'
import User from './components/user'
import BasicInfoEdit from './components/basic_info_edit'
import { constants } from 'fs';
export default {
  name: "basic",
  data: () =>({
    tab: null,
    items: [
      '我的主页',
      '用户',
      '角色',
      '权限码'
    ],
    rules: [
      value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
    ],
    alertVisible: false,
    alertType: '',
    alertText: '',
    delayTime: 2000
  }),
  components: {
    AuthCode,
    Role,
    User,
    BasicInfoEdit
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState({
      username: state => state.user.username,
      avatar: state => state.user.avatar,
      userId: state => state.user.userId,
    }),
    ...mapGetters([
      'basicUserinfo'
    ])
  },
  methods: {
    ...mapActions([
      'getAuthCodeAction',
      'getRoleAction',
      'getUserListAction',
      "upLoadAvatarAction",
      "updateAction",
      "authorizationAction",
      "getUserInfoAction",
      "editUserBasicInfo"
    ]),
    message (alertType, alertText) {
      this.alertVisible = true
      this.alertType = alertType
      this.alertText = alertText
    },
    init () {
      const p = this.getAuthCodeAction()
      const q = this.getRoleAction()
      const r = this.getUserListAction()
      
      Promise.all([p, q, r]).catch(err => {
        this.message('error', `Error: ${err.message}`)
      })
      this.getUserInfoAction(this.userId) 
        .catch(err =>  this.message('error', `Error: ${err.message}`))
    },
    async handleChange (e) {
      const formData = new FormData()
      formData.append('file', e,  e.name)
      try {
        const avatar = await this.upLoadAvatarAction(formData)
        await this.updateAction({ avatar: avatar })
        this.authorizationAction()
      }catch(err) {
        this.message('error', `Error: ${err.message}`)
      }
    },
    handleSubmit () {
      this.editUserBasicInfo()
        .then(_ => this.message('success', '修改成功!'))
        .catch(err => this.message('error', `Error: ${ err.message }`))
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar_wrap{
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
}

.file_upload {
  position: absolute;
  top: 56px;
  left: 114px;
  opacity: 0;
  ::v-deep .v-input__icon--prepend{
    width: 90px !important;
    height: 90px !important;
  }
  ::v-deep .v-icon.v-icon.v-icon--link {
    height: 80px;
    width: 80px !important;
  }
}
// ::v-deep .v-text-field fieldset, .v-text-field .v-input__control{
//   display: none !important;
// }
</style>

