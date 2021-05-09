<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>信息报送列表</span>
      <c-button flat iconType="ic_xinzeng" @click="handleCreate"> 
        <span>新增</span>
      </c-button>
      <c-button flat iconType="ic_daoru" class="file_upload_button">
        <span>导入 <input type="file" @change="handleImport($event)"></span>
      </c-button>

      
    </header>
    <section class="c_body">
      <c-search 
        :searchList.sync="searchList"
        @search="handleSearch"

        :psList="psList"
        :policeList="policeList"
        :statusList="statusList"
        @policeStationChange="handleChangepoliceStation"
      />
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
              <template v-if="item.property === 'status'" >
                <span :class="{
                    'c_red': scope.row.status === 'init',
                    'c_green': scope.row.status === 'finish',
                    'c_grey': scope.row.status === 'fail',
                  }">{{ computedStatus(scope.row.status) }}</span>
              </template>
              <template v-else >
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
            <el-button
              v-if="scope.row.status=== 'init' "
              @click.native.prevent="handleAudit(scope.row)"
              type="text"
              size="small">
              审核
            </el-button>
            <span v-if="scope.row.status=== 'init'"> | </span>

            <el-button
              @click.native.prevent="handleEdit(scope.row)"
              type="text"
              size="small">
              编辑
            </el-button>
            <span> | </span>
            <el-button
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

    <el-dialog
      title="审核"
      :visible.sync="auditVisible"
      width="460px"
    >
      <section class="aduit_dialog_body">
        <div class="title">审核意见</div>
        <el-input 
          type="textarea" 
          v-model="auditInfo" 
          placeholder="请输入"
          :autosize="{ minRows: 4, maxRows: 8}"
        ></el-input>
        <div class="notes">注：若拒绝审批通过，需输入审核意见</div>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleResolveAudit">通 过</el-button>
        <el-button @click="handleRejectAduit">返 回</el-button>
      </span>
    </el-dialog>

    <c-c-dialog
      :visible="visible"
      @confirm="handleConfirm"
      @close ="handleClose"
    ></c-c-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data () {
    return {
      searchList: [
        { label: '情报标题', key: 'title', value: '', type: 'el-input', clearable: true },
        { label: '情报编号', key: 'infoNo', value: '', type: 'el-input', clearable: true},
        { label: '上报人', key: 'sysUserId', value: '', type: 'el-select', option: "policeList",   clearable: true},
        { label: '上报单位', key: 'orgId', value: '', type: 'el-select', option: "psList", clearable: true },
        { label: '上报时间', key: 'time', value: '', type: 'el-date-picker', datePickerType: 'daterange', clearable: true },
        { label: '所属信息员', key: 'personNo', value: '', type: 'el-input', clearable: true },
        { label: '信息状态', key: 'status', value: '', type: 'el-select',option: "statusList",  clearable: true },
      ],
      searchObj: {},
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      tableHeader: [
        { property: 'infoNo', label: '情报编号', width: ''},
        { property: 'title', label: '情报标题', width: ''},
        { property: 'owner', label: '上报人', width: ''},
        { property: 'deptName', label: '上报单位', width: ''},
        { property: 'reportTime', label: '上报时间', width: '200'},
        { property: 'personNo', label: '所属信息员', width: ''},
        { property: 'status', label: '信息状态', width: ''},
      ],
      auditVisible: false,
      auditInfo: "",
      auditId: 0,

      removeId: 0,

      visible: false,
    }
  },
  computed: {
    ...mapState({
      list: state => state.infoSubmit.infoSubmitList,
      total: state => state.infoSubmit.infoSubmitTotal,

      psList: state => state.policeStationList,
      policeList: state => state.policeList,
      useDirList: state => state.useDirectionList,
      statusList: state => state.infoSubmitstatusList
    }),
  },
  mounted() {
    this.init()
  },
  methods: {

    ...mapActions([
      "getPoliceStationListAction",
      "getPoliceListAction",

      "createOrUpdateInfoSubmitAction",
      "removeInfoSubmitAction",
      "infoSubmitImportAction",
      "getInfoSubmitDetailAction",
      "getInfoSubmitListAction",
      "auditInfoSubmitAction"
    ]),
    ...mapMutations([
      'SET_INFOSUBMIT_ITEM'
    ]),
    computedStatus(status) {
      switch (status) {
        case 'init': return '待审核';
        case 'finish': return '已审核';
        case 'fail': return '已退回';
        default: return ''
      }
    },
    init () {
      this.getInfoSubmitListAction().catch(err => console.log(err))
      this.getPoliceStationListAction().catch(err => console.log(err))
    },
    handleChangepoliceStation (orgId) {
      this.getPoliceListAction(orgId).catch(err => console.log(err))
    },

    handleCreate () {
      this.SET_INFOSUBMIT_ITEM({})
      this.$router.push({ name: "InfoSubmitEdit" })
    },

    handleImport (event) {
      if(event.target.files.length === 0) { return }
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.infoSubmitImportAction(formData)
        .then(_ => this.getInfoSubmitListAction())
        .catch(err => this.$message.error('上传失败' + err))
    },

    handleEdit (row) {
      this.getPoliceListAction(row.orgId)
      this.$router.push({ 
        name: "InfoSubmitEdit",
        query: { id: row.id }
      })
    },

    handleRemove (row) {
      this.removeId =  row.id
      this.visible = true
    },

    handleAudit (row) {
      this.auditId = row.id
      this.auditVisible = true
    },
    handleResolveAudit () {
      const param = {
        auditInfo: this.auditInfo,
        id: this.auditId,
        isPass: true,
        type: 'info_person'
      }
      this.auditInfoSubmitAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.getInfoSubmitListAction()
        })
        .catch(err => console.log(err))
    },
    handleRejectAduit () {
      if(this.auditInfo === '') {
        this.$message.error('拒绝审批通过，需输入审核意见')
        return
      }
      const param  = {
        auditInfo: this.auditInfo,
        id: this.auditId,
        isPass: false,
        type: 'info_person'
      }
      this.auditInfoSubmitAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.getInfoSubmitListAction()
        })
        .catch(err => console.log(err))
    },
    handleClose() {
      this.visible = false
    },
    handleConfirm () {
      if(this.removeId !== 0) {
        this.removeInfoSubmitAction(this.removeId)
          .then(_ => {
            this.removeId = 0
            this.visible = false
            this.getInfoSubmitListAction()
          })
      }
    },
 
    handleSearch (searchObj) {
      let { status, time,  ...otherOptions  } = searchObj
      if(time) {
        const beginTime = time[0]
        const endTime = time[1]
        otherOptions.beginTime = beginTime
        otherOptions.endTime = endTime
      }
      if(status) {
        const res = this.statusList.find(item => item.id === status) || {}
        otherOptions.status = res.status
      }
      this.searchObj = {...otherOptions}
      this.pagination = { pageNo: 1, pageSize: 10 }
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
    searchFn () {
      let search = Object.assign(this.searchObj, this.pagination)
      this.getInfoSubmitListAction(search);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/style/custom.scss';
@import '@/assets/style/file_upload_button.scss';

::v-deep .el-dialog__header {
  border-bottom: 1px solid #F2F2F2;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #F2F2F2;
}
::v-deep .el-dialog__body {
  padding: 20px;
}
::v-deep .el-icon-close:before {
  color: #787878;
  font-weight: bold;
  font-size: 20px;
}

.aduit_dialog_body {
  display: flex;
  flex-direction: column;
  .title {
    margin-bottom: 10px;
  }
  .notes {
    margin-top: 10px;
  }
}
</style>