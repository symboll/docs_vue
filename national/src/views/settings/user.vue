<template>
 <div class="c_wrap">
    <aside class="c_sidebar">
      <header class="c_sidebar_header">
        <span>组织名称</span>
        <el-input v-model="organValue" @input="handleSearch"></el-input>
      </header>
      <section class="c_sidebar_body">
        <el-menu 
          @select="handleSelected" 
          @open="handleSelected"
          @close="handleSelected"
          :default-active="selectedPrganId">
          <organ-item :organList="organTree"></organ-item>
        </el-menu>
      </section>
    </aside>
    <section class="c_body ">
      <header class="c_header">
        <div class="title">用户列表</div>
        <c-button
          v-if="buttonList('user').includes('add')" 
          flat iconType="ic_xinzeng" @click="handleCreate">
          <span >新增</span>
        </c-button>
        <div class="search_wrap">
          <el-input v-model="userSearchValue"></el-input>
          <c-button icon grey :rotate="rotate" iconType="ic_chognzhi" @click="handleUserSearch">
          </c-button>
        </div>
      </header>
      <el-table
        class="c_table"
        :data="list"
        highlight-current-row
        height="710"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" wdith="100"></el-table-column>
        <template v-for="item in tableHeader">
          <el-table-column
            :key="item.property"
            :label="item.label"
            :width="item.width"  
          >
            <template slot-scope="scope">
              <template v-if="item.property === 'roles'">
                <!-- {{ scope.row['roles'] }} -->
                <span v-for="i in scope.row['roles']" :key="i.id">
                  {{ i.name }}
                </span>
              </template>
              <template v-else-if="item.property === 'delFlag'">
                <el-switch
                  @change="handleChange($event, scope.row)"
                  v-model="scope.row['delFlag']"
                  :active-text="scope.row['delFlag']?'启用':'禁用'"   
                >
                </el-switch>
              </template>
              <template v-else>
                <span>{{ scope.row[item.property] }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <template v-if="buttonList('user').includes('info')" >
              <el-button
                @click.native.prevent="handleView(scope.row)"
                type="text"
                size="small">
                详情
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('user').includes('edit')" >
              <el-button 
                @click.native.prevent="handleEdit(scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('user').includes('del')" >
            <el-button 
                @click.native.prevent="handleRemove(scope.row)"
                type="text"
                size="small">
                删除
              </el-button>
              <span> | </span>
            </template>
            <el-button
              v-if="buttonList('user').includes('rest')" 
              @click.native.prevent="handleReset(scope.row)"
              type="text"
              size="small">
              重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="c_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </section>

    <c-t-dialog
      :visible="visible"
      :title="title"
      @confirm="handleConfirm"
      @close ="handleClose"
    >
       <el-form 
        label-width="120px"
        :rules="rules"
        :model="userInfo"
        ref="form"
      >
        <el-form-item
          v-for="item in createOrEditForm" 
          :key="item.key" 
          :label="item.label"
          :prop="item.key"
        >
          <component 
            :is="item.type" 
            :multiple="item.multiple"
            v-model="userInfo[item.key]" 
          >            
            <template v-if="item.option && (item.key === 'orgId' || item.key === 'roleIdList')">
              <el-option 
                v-for="cur in computedList(item.option)"
                :key="cur.id"
                :label="cur.name"
                :value="cur.id"
              />
            </template>
          </component>
        </el-form-item>
      </el-form>
    </c-t-dialog>
    <c-c-dialog
      :visible="deleteVisible"
      @confirm="deleteConfirm"
      @close="deleteClose"
    ></c-c-dialog> 
  </div>
</template>

<script>
import { debounce } from 'lodash-es'
import { mapActions, mapState, mapGetters } from 'vuex'
import OrganItem from '../../components/user_organ_item'
import { deflate } from 'zlib';
import { constants } from 'fs';
export default {
  data() {
    return {
      organValue: "",
      selectedPrganId: "",
      organId: '',
      rotate:false,
      userSearchValue: "",
      tableHeader: [

        { property: 'username', label: '姓名', width: ''},
        { property: 'accountName', label: '账号', width: ''},
        { property: 'telephone', label: '联系电话', width: ''},
        { property: 'orgName', label: '所属组织', width: ''},
        { property: 'roles', label: '所属角色', width: '260px'},
        { property: 'delFlag', label: '状态', width: ''},
      ],
      createOrEditForm: [
        { label: '姓名', key: 'username', type: 'el-input'},
        { label: '账号', key: 'accountName', type: 'el-input'},
        { label: '联系电话', key: 'telephone', type: 'el-input' },
        { label: '所属角色', key: 'roleIdList', type: 'el-select', option: "roleList", multiple: true},
        { label: '所属组织', key: 'orgId', type: 'el-select', option: "organList"},
      ],
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
        accountName: [{ required: true, message: '请输入账号', trigger: 'blur' },],
        telephone: [{ required: true, message: '请输入联系电话', trigger: 'blur' },],
        roleIdList: [{ required: true, message: '请选择所属角色', trigger: 'blur' },],
        orgId: [{ required: true, message: '请选择所属组织', trigger: 'blur' },],
      },
      pagination: {
        pageSize: 10,
        pageNo: 1
      },
      visible: false,
      title: '',
      itemInfo: {},
      removeId: 0,
      orgId: 0,
      deleteVisible: false
    }
  },
  components: {
    OrganItem
  },
  computed: {
    ...mapState({
      organTree: state => state.user.organTree,
      organList: state => state.user.organList,
      list: state => state.user.userList,
      total: state => state.user.userListTotal,
      userInfo: state => state.user.userInfo,
      roleList: state => state.role.roleList,
      currentUser: state => state.user.currentUser
    }),
    ...mapGetters([
      'buttonList'
    ])
  },
  methods: {
    ...mapActions([
      'getCurOrgTreeAction',
      'getUserListAction',

      'getRoleListByParamAction',
      'getOrganListAction',
      'createUserAction',
      'getCurrentUserInfoAction',
      'getUserInfoAction',
      'modifyUserAction',
      'deleteUserByIdAction',
      'disableOrEnableAction',
      'resetPasswordAction'
    ]),
    handleChange(event, row) {
      this.disableOrEnableAction({id: row.id, delFlag: event})
        .then(_ => {
          this.$message.success(event ? "启用成功": "禁用成功")
          this.userListSearch(row.orgId)
        })
        .catch(err => console.log(err))
    },
    handleView () {},
    handleEdit (row) {
      this.getUserInfoAction(row.id)
        .then(_ => {
          this.visible = true
          this.title ='编辑'
        })
        .catch(err => console.log(err))
    },
    handleRemove (row) {
      this.removeId = row.id
      this.orgId = row.orgId
      this.deleteVisible = true
    },
    deleteConfirm () {
      this.deleteVisible = false
      this.deleteUserByIdAction(this.removeId)
        .then(res => {

          this.userListSearch(this.orgId)
          this.$message.success('删除成功!')
        })
    },
    deleteClose () {
      this.deleteVisible = false
    },

    handleReset (row) {
      this.resetPasswordAction(row.id)
        .then(_ => {
          this.$message.success('重置完成!')
        })
        .catch(err => this.$message.error('重置失败'+ err))
    },
    handleCreate () {
      this.visible = true
      this.title ='新增'
    },
    handleConfirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(this.userInfo.id) {
            this.modifyUserAction({
              ...this.userInfo,
              orgIdListStr: this.userInfo.orgId,
              roleIdListStr: this.userInfo.roleIdList.join('@'),
            })
              .then(res => {
                this.handleClose()
                this.$message.success('修改成功！')
                this.userListSearch(this.userInfo.orgId)
              })
              .catch(err => this.$message.error('修改失败！'+ err))
          }else {        
            this.createUserAction({
              ...this.userInfo,
              orgIdListStr: this.userInfo.orgId,
              roleIdListStr: this.userInfo.roleIdList.join('@'),
              accountName: this.userInfo.username,
              password: 123456,
              delFlag: true,
              online: true
            })
              .then(res => {
                this.handleClose()
                this.$message.success('创建成功！')
                this.userListSearch(this.userInfo.orgId)
              })
              .catch(err => this.$message.error('创建失败！'+ err))
          }
        } else {
          this.$message.error('请输入全部信息后，提交!')
          return false;
        }
      })

    },
    handleClose () {
      this.visible = false
      this.title =''
    },
    computedList (option) {
      switch (option) {
        case 'roleList': return this.roleList;
        case 'organList': return this.organList;
        default: return []
      }
    },
    handleSelected (key, path) {
      this.organId = key
      this.userListSearch()
    },

    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.userListSearch()
    },
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.userListSearch()      
    },

    handleSearch: debounce(function (value) {
      this.searchFn({  hasOrg: false, name: value })
    }, 800),

    handleUserSearch () {
      this.userListSearch(this.userSearchValue)
    },

    userListSearch (username) {
      const params = {
        orgId: this.organId,
        ...this.pagination
      }
      if(username) {
        params.username = username
      }
      this.getUserListAction(params)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    },

    searchFn(params = {}) {
      this.getCurOrgTreeAction(params)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    },
    init () {
      this.getCurrentUserInfoAction()
      this.getRoleListByParamAction()
      this.getOrganListAction()
    }
  },
  mounted() {
    this.searchFn()
    this.init()
  },
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom_sidebar.scss';
  .c_sidebar {
    flex-basis: 300px !important;
    &_header {
      span {
        width: 100px;
      }
    }
  }
  .c_body {
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .c_header {
      height: 60px;
      display: flex;
      align-items: center;
      .title {
        font-weight: bold;
        margin-left: 20px;
        margin-right: 20px;
      }
      .search_wrap{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20px;
        .el-input {
          width: 300px;
        }
      }
    }
  }
</style>