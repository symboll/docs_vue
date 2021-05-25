<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="c_wrap">
      <header class="c_header">
        <div @click="handleBack" class="back">
          <i class="el-icon-arrow-left"></i>
          返回
        </div>
        <el-button type="primary" class="c_btn" round @click="handleEdit">
          编辑
        </el-button>
      </header>
      <section class="c_body">
        <div class="c_header_item_info">
          <div v-for="item in showInfoList" :key="item.key" :class="{
            'title': item.type === 'title',
            'line': item.type === 'line'
          }">
            <template v-if="item.type ==='title'">
              <div>{{ item.label }}</div>
            </template>

            <template v-else-if="item.type === 'line'">
              <div>{{ item.label }}</div>
              <div v-if="item.key === 'status' || (item.key === 'cancelStatus' && itemInfo['reportFlag'])">
                {{ showValueMap(itemInfo[item.key], itemInfo["reportFlag"]) }} 
                <span v-if="itemInfo[item.key] === 'fail'" class="c_primary" @click="handleApply(item.key)" >重新申请>>></span>
              </div>  
              <div v-else>{{ itemInfo[item.key] }}</div>
            </template>
            <template v-else>
              <div>{{ item.label }}</div>
              <div>{{ itemInfo[item.key] }}</div>
            </template>
          </div>
        </div>

        <c-table-pagin 
          tableTitle="信息员接待联络情况"
          :list="receptionList"
          :total="receptionListTotal"
          :tableHeader="tableHeader1"
          @create="handleCreate1"
          @search="handleSearch1"
          @detail="handleDetail1"
          @edit="handleEdit1"
          @remove="handleRemove1"
        />
        <c-table-pagin 
          tableTitle="信息员考核情况"
          :list="assessList"
          :total="assessListTotal"
          :tableHeader="tableHeader2"
          @create="handleCreate2"
           @search="handleSearch2"
          @detail="handleDetail2"
          @edit="handleEdit2"
          @remove="handleRemove2"
        />
      </section>
      <c-t-dialog
        :visible="visible"
        :title="title"
        confirmButtonText='保 存'
        width="680px"
        :showConfirm="showConfirm1"
        @confirm="handleConfirm1"
        @close="handleClose1"
      >
        <el-form label-width="120px" :model="receptionItem" ref="form1" :rules="rules1">
          <el-form-item 
            v-for="item in createOrEditForm1"
            :key="item.key"
            :label="item.label"
            :prop="item.key"
            :class="{
              'c_disabled': !showConfirm1
            }"
          >
            <component 
              :is="item.type" 
              v-model="receptionItem[item.key]" 
              :type="item.childType ? item.childType : 'text'"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="!showConfirm1"
            >
              <template v-if="item.type === 'el-select'">
                <template v-if="item.key === 'sysUserId'">
                  <el-option v-for="item in computedOption(item.option)"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  ></el-option>
                </template>
                <template v-else>
                  <el-option v-for="item in computedOption(item.option)"
                    :key="item.id"
                    :value="item.name"
                    :label="item.name"
                  ></el-option>
                </template>
              </template>

            </component> 
          </el-form-item>
        </el-form>
      </c-t-dialog>

      <c-c-dialog
        :visible="removeVisible1"
        @confirm="removeConfirm1"
        @close="removeClose1"
      ></c-c-dialog> 



      <c-t-dialog
        :visible="visible2"
        :title="title2"
        confirmButtonText='保 存'
        width="680px"
        :showConfirm="showConfirm2"
        @confirm="handleConfirm2"
        @close="handleClose2"
      >
        <el-form label-width="120px" :model="assessItem" ref="form2" :rules="rules2">
          <el-form-item 
            v-for="item in createOrEditForm2"
            :key="item.key"
            :label="item.label"
            :prop="item.key"
            :class="{
              'c_disabled': !showConfirm2
            }"
          >
            <component 
              :is="item.type" 
              v-model="assessItem[item.key]" 
              :type="item.childType ? item.childType : 'text'"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :disabled="!showConfirm2"
            >
              <template v-if="item.type === 'el-select'">
                <template v-if="item.key === 'sysUserId'">
                  <el-option v-for="item in computedOption(item.option)"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  ></el-option>
                </template>
                <template v-else>
                  <el-option v-for="item in computedOption(item.option)"
                    :key="item.id"
                    :value="item.name"
                    :label="item.name"
                  ></el-option>
                </template>
              </template>

            </component> 
          </el-form-item>
        </el-form>
      </c-t-dialog>

      <c-c-dialog
        :visible="removeVisible2"
        @confirm="removeConfirm2"
        @close="removeClose2"
      ></c-c-dialog> 
    </div>
  </el-scrollbar>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { constants } from 'fs';
import { setTimeout } from 'timers';
export default {
  data () {
    return {
      tableHeader1:[
        { property: 'sysUserName', label: '指挥民警', width: ''},
        { property: 'codeName', label: '代号', width: ''},
        { property: 'receptionTime', label: '接待(联络)时间', width: '200'},
        { property: 'address', label: '地点(联络方式)', width: ''},
        { property: 'remark', label: '备注', width: ''},
      ],
      tableHeader2:[
        { property: 'name', label: '姓名', width: ''},
        { property: 'idCard', label: '身份证号', width: ''},
        { property: 'sysUserName', label: '专管民警', width: ''},
        { property: 'assessPeriod', label: '考核时段', width: ''},
      ],
      showInfoList: [
        { key: "title1", label: "基础信息", type: "title"},
        { key: "personNo", label: "信息员代号" },
        { key: "useType", label: "使用方向" },
        { key: "deptName", label: "所属派出所" },
        { key: "sysUserName", label: "责任民警" },
        { key: "contact", label: "联络频率" },
        { key: "assess", label: "考核频率" },
        { key: "personLevel", label: "信息员级别" },
        { key: "title2", label: "审核信息", type: "title" },
        { key: "status", label: "报备审核状态", type: "line" },
        { key: "remark", label: "审核意见", type: "line"  },
        { key: "cancelStatus", label: "撤销报备审核状态", type: "line"  },
        { key: "cancelRemark", label: "审核意见", type: "line"  },
      ],
      createOrEditForm1: [
        { label: '指挥民警', key: 'sysUserId',  type: 'el-select', option: "policeList", },
        { label: '代号', key: 'codeName', type: 'el-input'},
        { label: '接待(联络)时间', key: 'receptionTime', type: 'el-date-picker', childType: 'datetime' },
        { label: '地点(联络方式)', key: 'address', type: 'el-select', option: "addressList" },
        { label: '备注', key: 'remark', type: 'el-input',childType: 'textarea' },
        { label: '主要内容', key: 'infoBody', type: 'el-input', childType: 'textarea' },
        { label: '所领导意见', key: 'auditInfo', type: 'el-input', childType: 'textarea' },
      ],
      createOrEditForm2: [
        { label: '姓名', key: 'name',  type: 'el-input' },
        { label: '身份证号', key: 'idCard', type: 'el-input'},
        { label: '专管民警', key: 'sysUserId', type: 'el-select',option: "policeList",},
        { label: '考核时段', key: 'assessPeriod', type: 'el-input'},
        { label: '建立单位', key: 'createDept', type: 'el-input'},

        { label: '布置任务情况', key: 'decorateTaskInfo', type: 'el-input',childType: 'textarea' },
        { label: '完成任务情况及工作效果', key: 'completeTaskInfo', type: 'el-input', childType: 'textarea' },
        { label: '主动发现线索及查证办理情况', key: 'foundCluesInfo', type: 'el-input', childType: 'textarea' },
        { label: '民警对本考核时段综合评定意见', key: 'userAssessInfo', type: 'el-input', childType: 'textarea' },
        { label: '民警对本考核时段综合评定意见2', key: 'userAssessInfoV2', type: 'el-input', childType: 'textarea' },
      ],
      rules1: {
        sysUserId: [{required: true, message: "请选择指挥民警", trigger: 'blur' }],
        codeName: [{required: true, message: "请输入代号", trigger: 'blur' }],
        receptionTime: [{required: true, message: "请选择接待(联络)时间", trigger: 'blur' }],
        address: [{required: true, message: "请选择地点(联络方式)", trigger: 'blur' }],
        remark: [{required: true, message: "请输入备注", trigger: 'blur' }],
        infoBody: [{required: true, message: "请输入主要内容", trigger: 'blur' }],
        auditInfo: [{required: true, message: "请输入所领导意见", trigger: 'blur' }],
      },
      rules2: {

      },
      visible: false,
      visible2: false,
      title: "",
      title2: "",
      showConfirm1: true,
      showConfirm2: true,
      removeVisible1: false,
      removeVisible2: false,
      removeId1: 0,
      removeId2: 0,
      pagination1: {
        pageSize: 10,
        pageNo: 1
      },
      pagination2: {
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  computed: {
    ...mapState({
      itemInfo: state => state.infoOfficer.infoOfficerItem,

      statusList: state => state.statusList,

      receptionList: state => state.reception.receptionList,
      receptionListTotal: state => state.reception.receptionListTotal,
      receptionItem: state => state.reception.receptionItem,

      assessList: state => state.assess.assessList,
      assessListTotal: state => state.assess.assessListTotal,
      assessItem: state => state.assess.assessItem,

      policeList: state => state.policeList,

      currentUser: state => state.user.currentUser,
      addressList: state => state.addressList
    })
  },
  mounted() {
    this.init()
    this.queryInfoPersonReception(this.pagination1)
    this.queryInfoPersonAssessList(this.pagination2)
  },
  methods: {
    ...mapMutations(['SET']),
    ...mapActions([
      'getInfoOfficerDetailAction',
      'cancelInfoOfficerAction',

      'getInfoPersonAssessListAction',
      'getInfoPersonAssessDetailAction',
      'createOrUpdateInfoPersonAssessAction',
      'removeInfoPersonAssessAction',

      'getInfoPersonReceptionListAction',
      'getInfoPersonReceptionDetailAction',
      'createOrUpdateInfoPersonReceptionAction',
      'removeInfoPersonReceptionAction',

      'getPoliceStationListAction',
      'getPoliceListAction',
      'getDicItemsAction'
    ]),
    handleApply (key) {
      const { id } = this.$route.query
      switch (key) {
        case 'status':
          this.handleEdit()
          break;
        case 'cancelStatus':
          this.cancelInfoOfficerAction(id)
          break;
        default:
          break;
      }
    },
    computedOption (option) {
      switch (option) {
        case 'policeList' : return this.policeList;
        case 'addressList': return this.addressList;
        default: return [];
      }
    },
    showValueMap (status, reportFlag) {
      const item = this.statusList.find(item => item.status === status && item.reportFlag === reportFlag) || {}
      return item.label
    },
    init () {
      const { id } = this.$route.query

      this.getInfoOfficerDetailAction(id)
        .catch(err => console.log(err))  

    },
    queryInfoPersonReception() {
      const { id } = this.$route.query
      this.getInfoPersonReceptionListAction({id, params: this.pagination1 })
        .catch(err => console.log(err))
    },
    queryInfoPersonAssessList () {
      const { id } = this.$route.query
      this.getInfoPersonAssessListAction({id, params: this.pagination2 })
        .catch(err => console.log(err))
    },
    handleBack () {
      this.$router.go(-1)
    },
    handleEdit () {
      const id = this.$route.query.id
      console.log(id)
      this.$router.push({ 
        name: "InfoOfficerEdit",
        query: { id }
      })
    },
    handleCreate1() {
      this.title = '创建'
      this.visible = true

      if(this.policeList.length === 0) {
        this.getPoliceListAction(this.currentUser.orgId)
          .catch(err => console.log(err))
      }

      if(this.addressList.length === 0) {
        this.getDicItemsAction({ typeCode: "地点联络方式", key: "addressList"  })
          .catch(err => console.log(err))
      }
    },
    handleConfirm1 () {

      this.$refs['form1'].validate((valid) => {
        if (valid) {
          const sysUserName = (this.policeList.find(item => item.id === this.receptionItem.sysUserId) || {}).name
          this.createOrUpdateInfoPersonReceptionAction({
            ...this.receptionItem,
            sysUserName,
            joinId: this.$route.query.id
          })
            .then(res => {
              this.handleClose1()
              this.$message.success(this.receptionItem.id ? '修改成功':'创建成功')
              this.SET({ module: "reception", key: "receptionItem", value: {} })
              this.queryInfoPersonReception()
            })
            .catch(err => this.$message.error(this.receptionItem.id ? '修改失败':'创建失败'+ err))
        } else {
          return false;
        }
      })      
    },
    handleClose1 () {
      this.visible = false
      
      setTimeout(() => {
        this.title = ''
        this.showConfirm1 = true
      }, 400)   
    },
    handleSearch1 (pagination) {
      this.pagination1 = pagination
      this.queryInfoPersonReception()
    },
    handleDetail1 (id) {
      this.getInfoPersonReceptionDetailAction(id)
        .then(res => {
          this.title = '详情'
          this.visible = true
          this.showConfirm1 = false
        })
        .catch(err => console.log(err))

      if(this.policeList.length === 0) {
        this.getPoliceListAction(this.currentUser.orgId)
          .catch(err => console.log(err))
      }

      if(this.addressList.length === 0) {
        this.getDicItemsAction({ typeCode: "地点联络方式", key: "addressList"  })
          .catch(err => console.log(err))
      }
    },
    handleEdit1 (id) {
      this.getInfoPersonReceptionDetailAction(id)
        .then(res => {
          this.title = '编辑'
          this.visible = true
        })
        .catch(err => console.log(err))

      if(this.policeList.length === 0) {
        this.getPoliceListAction(this.currentUser.orgId)
          .catch(err => console.log(err))
      }

      if(this.addressList.length === 0) {
        this.getDicItemsAction({ typeCode: "地点联络方式", key: "addressList"  })
          .catch(err => console.log(err))
      }
    },
    handleRemove1 (id) {
      this.removeId1 = id
      this.removeVisible1 = true
    },
    removeConfirm1 () {
      if(this.removeId1 !== 0) {
        this.removeInfoPersonReceptionAction(this.removeId1)
          .then(_ => {
            this.removeVisible1 = false
            this.$message.success('删除成功')
            this.queryInfoPersonReception()
          })
      }
    },
    removeClose1 () {
      this.removeVisible1 = false
    },


    handleCreate2() {
      this.title2 = '创建'
      this.visible2 = true

      if(this.policeList.length === 0) {
        this.getPoliceListAction(this.currentUser.orgId)
          .catch(err => console.log(err))
      }
    },
    handleConfirm2 () {
      this.$refs['form2'].validate((valid) => {
        if (valid) {
          const sysUserName = (this.policeList.find(item => item.id === this.assessItem.sysUserId) || {}).name
          this.createOrUpdateInfoPersonAssessAction({
            ...this.assessItem,
            sysUserName,
            joinId: this.$route.query.id
          })
            .then(res => {
              this.handleClose2()
              this.$message.success(this.assessItem.id ? '修改成功':'创建成功')
              this.SET({ module: "assess", key: "assessItem", value: {} })
              this.queryInfoPersonAssessList()
            })
            .catch(err => this.$message.error(this.assessItem.id ? '修改失败':'创建失败'+ err))
        } else {
          return false;
        }
      })    
    },
    handleClose2 () {
      this.visible2 = false
      setTimeout(() => {
        this.title2 = ''
        this.showConfirm2 = true
      }, 400)   
    },

    handleSearch2 (pagination) {
      this.pagination2 = pagination
      this.queryInfoPersonAssessList()
    },
    handleDetail2 (id) {
      this.getInfoPersonAssessDetailAction(id)
        .then(res => {
          this.title2 = '详情'
          this.visible2 = true
          this.showConfirm2 = false
        })
        .catch(err => console.log(err))

      if(this.policeList.length === 0) {
        this.getPoliceListAction(this.currentUser.orgId)
          .catch(err => console.log(err))
      }
    },
    handleEdit2 (id) {
      this.getInfoPersonAssessDetailAction(id)
        .then(res => {
          this.title2 = '编辑'
          this.visible2 = true
        })
        .catch(err => console.log(err))

      if(this.policeList.length === 0) {
        this.getPoliceListAction(this.currentUser.orgId)
          .catch(err => console.log(err))
      }
    },
    handleRemove2 (id) {
      this.removeId2 = id
      this.removeVisible2 = true
    },
    removeConfirm2 () {
      if(this.removeId2 !== 0) {
        this.removeInfoPersonAssessAction(this.removeId1)
          .then(_ => {
            this.removeVisible2 = false
            this.$message.success('删除成功')
            this.queryInfoPersonAssessList()
          })
      }
    },
    removeClose2 () {
      this.removeVisible2 = false
    },
  },
}

</script>
<style lang="scss" scoped>
  @import './index.scss';
  ::v-deep .scrollbar-wrapper.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default{
    height: calc(100vh - 48px);
  }   
  ::v-deep .el-input.is-disabled .el-input__inner,
  ::v-deep .el-textarea.is-disabled .el-textarea__inner{
    background-color: #fff;
    border: none;
    color: #606266;
  }

  ::v-deep .el-input.el-input--small.is-disabled.el-input--suffix i {
    display: none;
  }
  ::v-deep .el-input--prefix.is-disabled .el-input__inner{
    padding-left: 15px;
  }

  ::v-deep  .c_disabled .el-form-item__label::before{
    display: none !important;
  }
</style>