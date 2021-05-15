<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>人员列表</span>
      <!-- v-if="buttonList('EmphasisPersonal').includes('add')" -->
      <c-button 
        flat iconType="ic_xinzeng" @click="handleCreate"> 
        <span>新增</span>
      </c-button>
      <c-button 
        v-if="buttonList('EmphasisPersonal').includes('import')"
        flat iconType="ic_daoru" class="file_upload_button">
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
        max-height="710"
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
              <template v-if="item.property === 'visitStatus'">
                <span 
                  :class="{
                    'c_red': scope.row['visitStatus'] === 'init'
                  }"
                >{{ visitStatusMap[scope.row['visitStatus']]  }}</span>
              </template>

              <template v-else-if="item.property === 'status'">
                <span>{{ statusMap[scope.row['status']]  }}</span>
              </template>
              <template  v-else>
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
            <template v-if="scope.row.status === 'init' && buttonList('EmphasisPersonal').includes('audit')">
              <el-button
                @click.native.prevent="handleAudit(scope.row)"
                type="text"
                size="small">
                审核
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('EmphasisPersonal').includes('info')">
              <el-button
                @click.native.prevent="handleDetail(scope.row)"
                type="text"
                size="small">
                详情
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('EmphasisPersonal').includes('edit')">
              <el-button
                @click.native.prevent="handleEdit(scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('EmphasisPersonal').includes('del')">
              <el-button
                @click.native.prevent="handleRemove(scope.row)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
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

    <c-c-dialog
      :visible="visible"
      @confirm="handleConfirm"
      @close="handleClose"
    ></c-c-dialog> 

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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  data () {
    return {
      searchList: [
        { label: '人员姓名', key: 'name', value: '', type: 'el-input', clearable: true },
        { label: '所属组织', key: 'orgId', value: '', type: 'el-select', option: "psList", clearable: true},
        { label: '管辖民警', key: 'sysUserId', value: '', type: 'el-select' , option: "policeList", clearable: true},
        { label: '审核状态', key: 'status', value: '', type: 'el-select', option: "statusList", clearable: true },
      ],
      searchObj: {},
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      tableHeader: [
        { property: 'name', label: '人员姓名', width: ''},
        { property: 'idCard', label: '身份证号', width: ''},
        { property: 'organizationType', label: '组织类别', width: ''},
        { property: 'sysUserName', label: '管辖民警', width: ''},
        { property: 'thoughtEvaluation', label: '思想评测', width: ''},
        { property: 'status', label: '状态', width: ''},
        { property: 'visitStatus', label: '走访记录状态', width: ''},
      ],
      removeId: 0,
      visible: false,

      auditId: 0,
      auditVisible: false,
      auditInfo: ''
    }
  },
  computed: {
    ...mapState({
      list: state => state.personal.personalList,
      total: state => state.personal.personalListTotal,
      itemInfo: state => state.personal.personalItem,

      psList: state => state.policeStationList,
      policeList: state => state.policeList,
      statusList: state => state.positionStatusList,

      statusMap: state => state.personal.statusMap,
      visitStatusMap: state => state.personal.visitStatusMap,
    }),
    ...mapGetters([
      'buttonList'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'getPersonalListAction',
      'getPersonalDetailAction',
      'createOrUpdatePersonalAction',
      'removePersonalAction',
      'auditPersonalAction',

      "getPoliceStationListAction",
      "getPoliceListAction",
      'personalImportAction'
    ]),
    ...mapMutations([
      "SET"
    ]),

    init () {
      this.getPersonalListAction()
        .catch(err => console.log(err))
      this.getPoliceStationListAction()
        .catch(err => console.log(err))
    },
    handleChangepoliceStation (orgId) {
      this.getPoliceListAction(orgId).catch(err => console.log(err))
    },

    handleCreate () {
      this.SET({ module: "personal", key: "personalItem", value: {} })
      this.$router.push({ name: "EmphasisPersonalEdit" })
    },

    handleImport (event) {
      if(event.target.files.length === 0) { return }
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.personalImportAction(formData)
        .then(_ => this.getInfoOfficerListAction())
        .catch(err => this.$message.error('上传失败' + err))
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
        type: 'person'
      }
      this.auditPersonalAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.getPersonalListAction()
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
        type: 'person'
      }
      this.auditPersonalAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.getPersonalListAction()
        })
        .catch(err => console.log(err))
    },




    handleDetail(row) {
      this.$router.push({ 
        name: "EmphasisPersonalInfo" , 
        query: { id: row.id }
      })
    },
    handleEdit (row) {
      this.getPoliceListAction(row.orgId)
      this.$router.push({ 
        name: "EmphasisPersonalEdit",
        query: { id: row.id }
      })
    },

    handleRemove (row) {
      this.removeId =  row.id
      this.visible = true
    },
    handleClose () {
      this.visible = false
    },
    handleConfirm () {
      if(this.removeId !== 0) {
        this.removePersonalAction(this.removeId)
          .then(_ => {
            this.visible = false
            this.getPersonalListAction()
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
      this.getPersonalListAction({
        ...this.searchObj,
        ...this.pagination
      });
    }
  },
};
</script>
<style lang='scss' scoped>
  @import '@/assets/style/custom.scss';
  @import '@/assets/style/file_upload_button.scss';

</style>