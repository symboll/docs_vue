<template>
  <div class="c_wrap">
    <aside class="c_sidebar">
      <header class="c_sidebar_header">
        <span>角色配置</span>
        <c-button flat iconType="ic_xinzeng" @click="handleCreateRole">
          <span>新增</span>
        </c-button>
      </header>
      <section class="c_sidebar_body">
        <el-menu @select="handleSelected"  :default-active="selectedRoleId">
          <el-menu-item 
            v-for="item in roleList"
            :key="item.id"
            :index="`${item.id}`"
          >
          <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </section>
    </aside>
    <section class="c_body role_body">
      <header class="role_header">
        <div>{{ selectedRoleName }}</div>
        <c-button 
          v-if="selectedRoleId"
          round iconType="ic_bianji"  @click="handleEdit">
          <span>编辑</span>
        </c-button>

        <el-button 
          v-if="selectedRoleId"
          round
          type="primary" 
          icon="el-icon-delete" 
          class="c_btn"
          @click="handleRemove" >删除</el-button>

      </header>
      <section class="role_card_wrap">
        <el-scrollbar  wrap-class="scrollbar-wrapper">
          <role-detail
            v-for="(item, index) in selectedRolePackaged" 
            :key="item.id"
            :type="item.type"
            :item="item"
            :defaultCheckedKeys="computedCheked([item])"
          ></role-detail>
        </el-scrollbar>
      </section>
    </section>

    <c-c-dialog
      :visible="visible"
      @confirm="handleConfirm"
      @close ="handleClose"
    >
    </c-c-dialog>
  </div>
</template>

<script>
import RoleDetail from './role_detail'
import { mapActions, mapState,mapMutations } from 'vuex'
export default {
  name: "role",
  components: {
    RoleDetail
  },
  data() {
    return {
      selectedId: '',
      visible: false
    }
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
  methods: {
    ...mapActions([
      'getRoleListByParamAction',
      'getRoleDetailAction',
      'deleteRoleAction'
    ]),
    ...mapMutations([
      'SET'
    ]),
    handleCreateRole () {

    },
    handleEdit () {
      this.$router.push({
        name: "roleEdit",
        query: {
          id: this.selectedRoleId
        }
      })
    },
    handleRemove () {
      if(!this.selectedId){
        this.$message.error('请先选择要删除的角色对象')
        return
      }
      this.visible = true
 
    },
    handleConfirm () {
      this.deleteRoleAction(this.selectedId)
        .then(res => {
          this.visible = false
          this.$message.success('删除成功')
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    handleClose () {
      this.visible = false
    },
    handleSelected (key, keyPath) {
      this.selectedId = key
      this.getRoleDetailAction(key).then(res => {
        this.SET({ module: "role", key: "selectedIds", value: this.computedCheked(res)  })
      })
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
  },
  mounted() {
    this.getRoleListByParamAction()
  },
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom_sidebar.scss';

.role_body {
  .role_header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > div {
      margin-right: 16px;
    }
    > div:nth-child(1) {
      width: 100px;
      text-align: right;
    }
  }
  .role_card_wrap {
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
}
</style>