<template>
  <div class="c_wrap">
    <header class="c_header"><span>参数列表</span></header>
    <section class="c_body">
      <el-table
        class="c_table"
        :data="list"
        highlight-current-row
        max-height="610"
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
              <span>{{ scope.row[item.property] }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button
              v-if="buttonList('params').includes('edit')"
              @click.native.prevent="handleEdit(scope.row)"
              type="text"
              size="small">
              编 辑
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
      title="编辑"
      @close="handleClose"
      @confirm="handleConfirm"
    >
      <el-form label-width="80px" :model="itemInfo" ref="form" :rules="rules">
        <el-form-item 
          v-for="item in formItenList"
          :key="item.key"
          :label="item.label"
          :prop="item.key"
        >
          <component 
            :is="item.type" 
            v-model="itemInfo[item.key]" 
            :clearable="item.clearable"
          >
          </component>
        </el-form-item>
      </el-form>
    </c-t-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations,mapGetters } from 'vuex'
export default {
  data() {
    return {
      pagination: {
        pageSize: 10, 
        pageNo:1
      },
      tableHeader: [
        { property: 'parameterName', label: '配置对象', width: ''},
        { property: 'parameterValue', label: '配置内容', width: ''},
      ],
      visible: false,
      formItenList: [
        { label: '配置对象', key: 'parameterName',  type: 'el-input', clearable: true },
        { label: '配置内容', key: 'parameterValue',  type: 'el-input', clearable: true },
      ],
      rules: {
        parameterName: [{ required: true, message: '请输入配置对象', trigger: 'blur' },],
        parameterValue:[{ required: true, message: '请输入配置内容', trigger: 'blur' },],
      }
    }
  },
  computed: {
    ...mapState({
      list: state => state.params.systemConfigList,
      total: state => state.params.systemConfigListTotal,
      itemInfo: state => state.params.paramsItemInfo
    }),
    ...mapGetters([
      'buttonList'
    ])
  },
  methods: {
    ...mapActions([
      'getSystemConfigListAction',
      'getConfigByIdAction',
      'editSystemConfigAction'
    ]),
    handleClose () {
      this.visible = false
    },
    handleConfirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.editSystemConfigAction(this.itemInfo)
            .then(_ => {
              this.visible = false
              this.searchFn()
            })
              .catch(err => console.log(err))
        }else {
          return
        }
      })
    },
    handleEdit(row) {
      this.getConfigByIdAction(row.id)
        .then(_ => {
          this.visible = true
        })

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
      const params = {
        ...this.pagination
      }
      this.getSystemConfigListAction(params)
    }
  },
  mounted() {
    this.searchFn()
  },
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom.scss';

 .c_body {
    height: calc(100vh - 112px) !important;
  } 
</style>