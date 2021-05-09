<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>信息员列表</span>
      <c-button flat iconType="ic_xinzeng" @click="handleCreate"> 
        <span>新增报备</span>
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
        :useDirList="useDirList"
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
                <span >
                {{ computedStatus(scope.row.status,scope.row.reportFlag)   }}
                </span>
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
              v-if="scope.row.status=== 'init' && !scope.row.reportFlag "
              @click.native.prevent="handleAudit(scope.row)"
              type="text"
              size="small">
              审核
            </el-button>
            <span v-if="scope.row.status=== 'init' && !scope.row.reportFlag "> | </span>

            <el-button
              v-if="scope.row.status=== 'finish' && !scope.row.reportFlag "
              @click.native.prevent="handleCancel(scope.row)"
              type="text"
              size="small">
              撤销报备
            </el-button>
            <span v-if="scope.row.status=== 'finish' && !scope.row.reportFlag "> | </span>

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
      :title="title"
      :visible="visible"
      :context="context"
      :subtitle="subtitle"
      @confirm="handleConfirm"
      @close="handleClose"
    ></c-c-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data () {
    return {
      searchList: [
        { label: '信息员代号', key: 'personNo', value: '', type: 'el-input', clearable: true },
        { label: '所属派出所', key: 'orgId', value: '', type: 'el-select', option: "psList", clearable: true},
        { label: '责任民警', key: 'sysUserId', value: '', type: 'el-select' , option: "policeList", clearable: true},
        { label: '使用方向', key: 'useType', value: '', type: 'el-select', option: "useDirList", clearable: true },
        { label: '状态', key: 'status', value: '', type: 'el-select', option: "statusList", clearable: true },
        { label: '创建时间', key: 'time', value: '', type: 'el-date-picker', datePickerType: 'daterange', clearable: true },
      ],
      searchObj: {},
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      tableHeader: [
        { property: 'personNo', label: '信息员代号', width: ''},
        { property: 'deptName', label: '所属派出所', width: ''},
        { property: 'sysUserName', label: '责任民警', width: ''},
        { property: 'useType', label: '使用方向', width: ''},
        { property: 'status', label: '状态', width: ''},
      ],
      auditVisible: false,
      auditInfo: "",
      auditId: 0,

      revokeReportId: 0,
      removeId: 0,

      visible: false,
      title: '',
      context: '',
      subtitle: ''
    }
  },
  computed: {
    ...mapState({
      list: state => state.infoOfficer.infoOfficerList,
      total: state => state.infoOfficer.infoOfficerTotal,
      psList: state => state.policeStationList,
      policeList: state => state.policeList,
      useDirList: state => state.useDirectionList,
      statusList: state => state.statusList
    }),
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      "getInfoOfficerListAction",
      "getPoliceStationListAction",
      "getPoliceListAction",
      "getDicItemsAction",
      "auditInfoOfficerAction",
      "cancelInfoOfficerAction",
      "removeInfoOfficerAction",
      "infoOfficerImportAction"
    ]),
    ...mapMutations([
      'SET'
    ]),
    computedStatus(status,reportFlag) {
      const item = this.statusList.find(item => item.status === status && item.reportFlag === reportFlag)
      return (item || {}).label || ""
    },
    init () {
      this.getInfoOfficerListAction().catch(err => console.log(err))

      this.getPoliceStationListAction().catch(err => console.log(err))
      this.getDicItemsAction({ typeCode: "使用方向", key: "useDirectionList"})
        .catch(err => console.log(err))
    },
    handleChangepoliceStation (orgId) {
      this.getPoliceListAction(orgId).catch(err => console.log(err))
    },

    handleCreate () {
      this.SET({module: "infoOfficer", key: "infoOfficerItem", value: {} })
      this.$router.push({ name: "InfoOfficerEdit" })
    },


    handleImport (event) {
      if(event.target.files.length === 0) { return }
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.infoOfficerImportAction(formData)
        .then(_ => this.getInfoOfficerListAction())
        .catch(err => this.$message.error('上传失败' + err))
    },

    handleEdit (row) {
      this.getPoliceListAction(row.orgId)
      this.$router.push({ 
        name: "InfoOfficerEdit",
        query: { id: row.id }
      })
    },

    handleRemove (row) {
      this.removeId =  row.id
      this.visible = true
      this.title = '删除'
      this.context = '确认删除吗?'
      this.subtitle = '删除后不能撤回，请确认'
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
      this.auditInfoOfficerAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.getInfoOfficerListAction()
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
      this.auditInfoOfficerAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.getInfoOfficerListAction()
        })
        .catch(err => console.log(err))
    },


    handleCancel (row) {
      this.revokeReportId =  row.id
      this.visible = true
      this.title = '撤销报备'
      this.context = '是否确定撤销报备?'
    },
    handleClose () {
      this.visible = false
    },
    handleConfirm () {
      if(this.revokeReportId ===0 && this.removeId !== 0) {
        this.removeInfoOfficerAction(this.removeId)
          .then(_ => {
            this.revokeReportId = 0
            this.title = ''
            this.context = ''
            this.subtitle = ''
            this.visible = false
            this.getInfoOfficerListAction()
          })
      }else if(this.removeId ===0 && this.revokeReportId !== 0) {
        this.cancelInfoOfficerAction(this.revokeReportId)
          .then( _ => {
            this.revokeReportId = 0
            this.title = ''
            this.context = ''
            this.visible = false
            this.getInfoOfficerListAction()
          })
      }

    },
 
    handleSearch (searchObj) {
      let { time, status, ...otherOptions } = searchObj
      if(time) {
        const beginTime = time[0]
        const endTime = time[1]
        otherOptions.beginTime = beginTime
        otherOptions.endTime = endTime
      }
      if(status) {
        const res = this.statusList.find(item => item.id === status) || {}
        otherOptions.status = res.status
        otherOptions.reportFlag = res.reportFlag
      }

      this.searchObj = otherOptions
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
      this.getInfoOfficerListAction(search);
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
