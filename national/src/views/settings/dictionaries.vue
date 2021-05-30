<template>
  <div class="c_wrap">
    <aside class="c_sidebar">
      <header class="c_sidebar_header">
        <span>字典大类</span>
      </header>
      <section class="c_sidebar_body">
        <!-- :default-active="" -->
        <el-menu @select="handleSelected"  >
          <el-menu-item 
            v-for="item in typeList"
            :key="item.id"
            :index="`${item.code}`"
          >
          <span>{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </section>
    </aside>
    <section class="c_body">
      <header class="c_header">
        <div class="title">字典列表</div>
        <c-button v-if="buttonList('dictionaries').includes('add')" flat iconType="ic_xinzeng" @click="handleCreate"> 
          <span>新增</span>
        </c-button>
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
              <template >
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
            <template v-if="buttonList('dictionaries').includes('edit')">
              <el-button 
                @click.native.prevent="handleEdit(scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <span> | </span>
            </template>
            <el-button
            v-if="buttonList('dictionaries').includes('del')"
              @click.native.prevent="handleRemove(scope.row)"
              type="text"
              size="small">
              删除
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
      @close="handleClose"
    >
      <el-form label-width="80px" :model="dictItemInfo" ref="form" :rules="rules">
        <el-form-item 
          v-for="item in formItenList"
          :key="item.key"
          :label="item.label"
          :prop="item.key"
        >
          <component 
            :is="item.type" 
            v-model="dictItemInfo[item.key]" 
            :type="item.childType ? item.childType : 'text'"
            :disabled="item.disabled"
            :clearable="item.clearable"
          >
            <template v-if="item.type === 'el-select'" >
              <el-option v-for="item in computedOption(item.option)"
                :key="item.id"
                :value="item.code"
                :label="item.name"
              ></el-option>
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
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: "dictionaries",
  data() {
    return {
      tableHeader: [
        { property: 'name', label: '字典名称', width: ''},
        { property: 'code', label: '字典编码', width: ''},
        { property: 'description', label: '属性描述', width: ''},
      ],
      formItenList: [
        { label: '字典名称', key: 'name',  type: 'el-input', clearable: true },
        { label: '字典编码', key: 'code',  type: 'el-input', disabled: true, clearable: true },
        { label: '上级字典', key: 'ownDicType', type: 'el-select', option: "typeList", clearable: true },
        { label: '属性描述', key: 'description',  type: 'el-input', childType:'textarea',  clearable: true },
      ],
      rules: {
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' },],
        ownDicType: [{ required: true, message: '请选择上级字典', trigger: 'blur' },],
        description: [{ required: true, message: '请输入属性描述', trigger: 'blur' },],
      },
      pagination: {
        pageNo: 1,
        pageSize: 10
      },

      editDictId: "",
      removeId: "",

      typeCode: "",
      title: "",
      visible: false,
      deleteVisible: false
    }
  },
  computed: {
    ...mapState({
      typeList: state => state.dictionaries.dictTypeList,
      list: state => state.dictionaries.dictItemList,
      total: state => state.dictionaries.dictItemTotal,
      dictItemInfo: state => state.dictionaries.dictItemInfo
    }),
    ...mapGetters([
      'buttonList'
    ])
  },
  methods: {
    ...mapActions([
      'getDictTypeListAction',
      'getDicMapItemAction',
      'addDictItemAction',
      'editDictionaryAction',
      'deleteDictionaryAction',
      'getDicItemDetailApi'
    ]),
    ...mapMutations([
      'SET'
    ]),
    computedOption (option) {
      switch (option) {
        case 'typeList': return this.typeList
        default: return []
      }
    },
    handleSelected(key) {
      this.typeCode = key
      this.searchFn()
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.searchFn()
    },
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.searchFn()      
    },
    searchFn() {
      this.getDicMapItemAction({ ...this.pagination, typeCode: this.typeCode})
    },

    handleCreate () {
      this.title = '新增字典'
      this.SET({module: 'dictionaries', key:'dictItemInfo', value: {
        name: "",
        code: "",
        ownDicType: "",
        description: ""
      } })
      this.visible = true
    },
    handleEdit(row) {
      this.title = '编辑字典'
      this.visible = true
      this.editDictId= row.id
      this.getDicItemDetailApi(row.id)
    },
    handleRemove (row) {
      this.deleteVisible = true
      this.removeId = row.id
      this.typeCode = row.ownDicType
    },
    deleteConfirm () {
      this.deleteVisible = false
      this.deleteDictionaryAction(this.removeId)
        .then(res => {
          this.searchFn()
          this.$message.success('删除成功!')
        })
    },
    deleteClose () {
      this.deleteVisible = false
    },
    handleClose () {
      this.visible = false
    },
    handleConfirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(this.dictItemInfo.id) {
            this.editDictionaryAction(this.dictItemInfo)
              .then(res => {
                this.visible = false
                this.title = ''
                this.$message.success('修改成功！')
                this.typeCode = this.dictItemInfo.ownDicType
                this.searchFn()
              })
              .catch(err => this.$message.error('修改失败！'+ err))
          }else {
            this.dictItemInfo.code = this.dictItemInfo.name
            this.addDictItemAction(this.dictItemInfo)
              .then(res => {
                this.visible = false
                this.title = ''
                this.$message.success('创建成功！')
                this.typeCode = this.dictItemInfo.ownDicType
                this.searchFn()
              })
              .catch(err => this.$message.error('创建失败！'+ err))
          }
        } else {
          this.$message.error('请输入全部信息后，提交!')
          return false;
        }
      })
    }
  },
  mounted() {
    this.getDictTypeListAction()
  },
}

</script>
<style lang='scss' scoped>
  
  @import '@/assets/style/custom_sidebar.scss';

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
    }
  }
</style>