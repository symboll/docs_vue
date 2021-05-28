<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>阵地列表</span>
      <c-button 
        v-if="buttonList('EmphasisPosition').includes('add')"
        flat iconType="ic_xinzeng" @click="handleCreate"> 
        <span>新增</span>
      </c-button>
      <c-button 
        v-if="buttonList('EmphasisPosition').includes('toExcel')"
        flat iconType="daochu" @click="handleExport">
        <span>导出</span>
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
              <!-- <template >
                <span>{{ scope.row[item.property] }}</span>
              </template> -->
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
            <template v-if="buttonList('EmphasisPosition').includes('audit')">
              <el-button
                @click.native.prevent="handleAudit(scope.row)"
                type="text"
                size="small">
                审核
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('EmphasisPosition').includes('tf')">
              <el-button
                @click.native.prevent="handleComplete(scope.row)"
                type="text"
                size="small">
                办结
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('EmphasisPosition').includes('tfAudit')">
              <el-button
                @click.native.prevent="handleCompleteAudit(scope.row)"
                type="text"
                size="small">
                办结审核
              </el-button>
              <span> | </span>
            </template>

            <template v-if="buttonList('EmphasisPosition').includes('info')">
              <el-button
                @click.native.prevent="handleDetail(scope.row)"
                type="text"
                size="small">
                详情
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('EmphasisPosition').includes('edit')">
              <el-button 
                @click.native.prevent="handleEdit(scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <span> | </span>
            </template>
            <el-button
              v-if="buttonList('EmphasisPosition').includes('del')"
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

    <el-dialog
      title="办结审核"
      :visible.sync="completeAuditVisible"
      width="460px"
    >
      <section class="aduit_dialog_body">
        <div class="title">审核意见</div>
        <div class="radio_wrap">
          <el-radio v-model="isHire" :label="true">录用</el-radio>
          <el-radio v-model="isHire" :label="false">不录用</el-radio>
        </div>
        <el-input 
          type="textarea" 
          v-model="completeAuditInfo" 
          placeholder="请输入"
          :autosize="{ minRows: 4, maxRows: 8}"
        ></el-input>
        <div class="notes">注：若拒绝审批通过，需输入审核意见</div>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="completeResolveAudit">通 过</el-button>
        <el-button @click="completeRejectAduit">返 回</el-button>
      </span>
    </el-dialog>

    <c-t-dialog    
      :visible="completeVisible"
      title="提交办结"
      @confirm="completeConfirm"
      @close="completeClose"
    >
      <div class="complete_wrap">
        是否确认提交办结
      </div>
    </c-t-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

import { baseURL } from '../../config/index.js'
import { getToken } from '../../lib/util.js'
export default {
  data () {
    return {
      searchList: [
        { label: '阵地名称', key: 'name', value: '', type: 'el-input', clearable: true },
        { label: '所属组织', key: 'orgId', value: '', type: 'el-select', option: "psList", clearable: true},
        { label: '关系民警', key: 'sysUserId', value: '', type: 'el-select' , option: "policeList", clearable: true},
        { label: '审核状态', key: 'status', value: '', type: 'el-select', option: "statusList", clearable: true },
      ],
      searchObj: {},
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      tableHeader: [
        { property: 'name', label: '阵地名称', width: ''},
        { property: 'type', label: '种类', width: ''},
        { property: 'cardNo', label: '登记证号', width: ''},
        { property: 'deptName', label: '管辖单位', width: ''},
        { property: 'sysUserName', label: '责任民警', width: ''},
        { property: 'status', label: '状态', width: ''},
        { property: 'visitStatus', label: '走访记录状态', width: ''},
      ],
      removeId: 0,

      visible: false,

      auditId: '',
      auditVisible: false,
      auditInfo: '',

      completeAuditId: '',
      completeAuditVisible: false,
      completeAuditInfo: '',
      isHire: true,

      completeId: '',
      completeVisible: false
    }
  },
  computed: {
    ...mapState({
      list: state => state.position.positionList,
      total: state => state.position.positionListTotal,
      itemInfo: state => state.position.positionItem,

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
      'getPositionListAction',
      'getPositionDetailAction',
      'createOrUpdatePositionAction',
      'removePositionAction',
      'auditPositionAction',
      'completePositionAction',
      'completeAuditPositionAction',

      "getPoliceStationListAction",
      "getPoliceListAction",
      'exportAction'
    ]),
    ...mapMutations([
      'SET'
    ]),

    init () {
      this.getPositionListAction()
        .catch(err => console.log(err))
      this.getPoliceStationListAction()
        .catch(err => console.log(err))
    },
    handleChangepoliceStation (orgId) {
      this.getPoliceListAction(orgId).catch(err => console.log(err))
    },

    handleCreate () {
      this.SET({ module: "position", key: "positionItem", value: {} })
      this.$router.push({ name: "EmphasisPositionEdit" })
    },

    handleExport() {
      window.location.href = `${baseURL}/api/position/v1/toExcel?Authorization=${getToken()}`
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
        type: 'position'
      }
      this.auditPositionAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.searchFn()
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
        type: 'position'
      }
      this.auditPositionAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.searchFn()
        })
        .catch(err => console.log(err))
    },
    handleComplete (row) {
      this.completeId = row.id
      this.completeVisible = true
    },
    completeConfirm () {
      this.completePositionAction(this.completeId)
        .then(res => {
          this.completeClose()
          this.searchFn()
        })
        .catch(err => console.log(err))
    },
    completeClose() {
      this.completeId = ''
      this.completeVisible = false
    },

    handleCompleteAudit (row) {
      this.completeAuditId = row.id,
      this.completeAuditVisible = true
    },
    completeResolveAudit () {
      const param = {
        auditInfo: this.completeAuditInfo,
        id: this.completeAuditId,
        isPass: true,
        isHire: this.isHire,
        type: 'position'
      }
      this.completeAuditPositionAction(param)
        .then(_ => {
          this.completeAuditInfo = ''
          this.completeAuditId = 0
          this.completeAuditVisible = false
          this.isHire = true
          this.searchFn()
        })
        .catch(err => console.log(err))
    },
    
    completeRejectAduit () {
       if(this.auditInfo === '') {
        this.$message.error('拒绝审批通过，需输入审核意见')
        return
      }
      const param  = {
        auditInfo: this.completeAuditInfo,
        id: this.completeAuditId,
        isPass: false,
        isHire: this.isHire,
        type: 'position'
      }
      this.completeAuditPositionAction(param)
        .then(_ => {
          this.completeAuditInfo = ''
          this.completeAuditId = 0
          this.completeAuditVisible = false
          this.isHire = true
          this.searchFn()
        })
        .catch(err => console.log(err))
    },

    handleDetail(row) {
      this.$router.push({ 
        name: "EmphasisPositionInfo" , 
        query: { id: row.id }
      })
    },
    handleEdit (row) {
      this.getPoliceListAction(row.orgId)
      this.$router.push({ 
        name: "EmphasisPositionEdit",
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
        this.removePositionAction(this.removeId)
          .then(_ => {
            this.visible = false
            this.getPositionListAction()
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
      this.getPositionListAction({
        ...this.searchObj,
        ...this.pagination
      });
    }
  },
};
</script>
<style lang='scss' scoped>
  @import '@/assets/style/custom.scss';

.aduit_dialog_body {
  display: flex;
  flex-direction: column;
  .title {
    margin-bottom: 10px;
  }
  .radio_wrap {
    display: flex;
    height: 40px;
    align-items: center;
  }
  .notes {
    margin-top: 10px;
  }
}

.complete_wrap {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
