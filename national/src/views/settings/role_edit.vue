<template>
  <div class="c_edit_wrap">
    <header class="c_edit_header">
      <div @click="handleBack" class="back">
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <div class="role_input">
        角色名称: <el-input :value="selectedRoleName"></el-input>
      </div>
      <el-button round class="c_btn mr_16" >返回</el-button>
      <c-button round iconType="ic_tijiao" @click="handleSubmit">
        <span>提交</span>
      </c-button>

    </header>
    <section class="c_edit_body">
      <el-scrollbar  wrap-class="scrollbar-wrapper">
        <role-detail
          v-for="(item, index) in selectedRolePackaged" 
          :key="item.id"
          :type="item.type"
          :item="item"
          :defaultCheckedKeys="computedCheked([item])"
          :defaultProps="defaultProps"
          @checkChange="checkChange"
        ></role-detail>
      </el-scrollbar>
    </section>
  </div>
</template>

<script>
import { mapState,mapActions, mapMutations } from 'vuex'
import RoleDetail from './role_detail'
export default {
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      }
    }
  },
  components: {
    RoleDetail
  },
  computed: {
    ...mapState({
      roleList: state => state.role.roleList,
      selectedRoleId: state => state.role.selectedRoleId,
      selectedRole: state => state.role.selectedRole,
      selectedRoleName: state => state.role.selectedRoleName,
      selectedIds: state => state.role.selectedIds
    }),
    selectedRolePackaged () {
      const leng = this.selectedRole.length % 3 
      switch (leng) {
        case 0: return this.selectedRole;
        case 1: return this.selectedRole.concat([{id: 'a', type: 'empty'}, {id: 'b', type: 'empty'}])
        case 2: return this.selectedRole.concat([{id: 'c', type: 'empty'}])
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'getRoleListByParamAction',
      'getRoleDetailAction',
      'addAuthToRoleAction'
    ]),
    ...mapMutations([
      'SET',
      'SET_SELECTED_IDS'
    ]),
    init () {
      const { id } = this.$route.query
      if(!this.selectedRoleId) {
        this.getRoleListByParamAction().then(res => {
          if(this.selectedRole.length === 0) {
            this.getRoleDetailAction(id).then(res => {
              this.SET({ module: "role", key: "selectedIds", value: this.computedCheked(res)  })
            })
              .catch(err => console.log(err))
          }else {
            const item = res.find(item => item.id === id) 
            this.SET({ module: "role", key: "selectedRoleId", value: id  })
            this.SET({ module: "role", key: "selectedRoleName", value: item.name })
          }
        })
      }
    },
    computedCheked (list) {
      const arr = []
      function a (list = []) {
        list.map(item => {
          if(item.checked) {
            arr.push(item.id)
          }
          if(item.children && item.children.length > 0) {
            a(item.children)
          }
        })
      }
      a(list)
      return arr
    },
    handleBack () {
      this.$router.go(-1)
    },
    checkChange ({id, value}) {
      this.SET_SELECTED_IDS({id, value})
    },
    handleSubmit () {
      const relationList = this.selectedIds.map(item => {
        return {
          checkStatus: 1,
          moduleId: item,
          roleId: this.selectedRoleId
        }
      })
      const params = {
        relationList,
        roleId: this.selectedRoleId
      }
      
      this.addAuthToRoleAction(params)
        .then(_ => {
          this.getRoleDetailAction(this.selectedRoleId)
          this.$message.success('修改成功!')
          this.$router.go(-1)
        })
        .catch(err => this.$message.error(err))

    }
  }

}

</script>
<style lang="scss" scoped>
 @import '@/assets/style/custom_edit.scss';

.role_input {
  flex: 1;
  padding-left: 50px;
  display: flex;
  align-items: center;
  .el-input{
    flex-basis: 240px;
    margin-left: 20px;
  }
}

  .c_edit_body {
    height: calc(100vh - 138px);
    .el-scrollbar {
      height: 100%;
      ::v-deep .el-scrollbar__view {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }
</style>