<template>
  <div class="c_wrap">

    <header class="c_header">
      <div @click="handleBack" class="back">
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <div class="c_header_btn_wrap">
        <el-button 
          v-if="itemInfo.status !== 'init'"
          round type="primary" class="c_btn" @click="handleTaskDistribution" 
        >任务下发</el-button>

        <!-- <c-button
          round iconType="ic_dayin"  @click="handlePrint"
        >
          <span>打印</span>
        </c-button> -->
        <c-button
          round iconType="ic_bianji"  @click="handleHeaderEdit">
          <span>编辑</span>
        </c-button>
      </div>
    </header>
    <section class="c_body">
      <div class="c_header_item_info">
        <div v-for="item in showInfoList" :key="item.key" :class="{
          'title': item.type === 'title'
        }">
          <template v-if="item.type ==='title'">
            <div>{{ item.label }}</div>
          </template>
          <template v-else-if="item.custom">
            <div>{{ item.label }}</div>
            <div> {{ showValueMap(item.key,itemInfo[item.key] )}}</div>
          </template>
          <template v-else>
            <div>{{ item.label }}</div>
            <div>{{ itemInfo[item.key] }}</div>
          </template>
        </div>
      </div>

      <section class="c_middle">
        <div class="c_middle_title">
          <div class="title">走访记录</div>
          <c-button
            v-if="itemInfo.status !== 'init'"
            flat iconType="ic_xinzeng" @click="handleCreate">
            <span >新增</span>
          </c-button>
        </div>
      </section>
      <section class="c_table_body">
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
                <template v-if="item.property ==='status'">
                  <span> {{ statusMap[scope.row['status']] }}</span>
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
              <template v-if="scope.row.status === 'init'">
                <el-button
                  @click.native.prevent="handleAudit(scope.row)"
                  type="text"
                  size="small">
                  审核
                </el-button>
                <span> | </span>
              </template>
              <template v-if="scope.row.status === 'finish'">
                <el-button
                  @click.native.prevent="handleEvaluate(scope.row)"
                  type="text"
                  size="small">
                  评价
                </el-button>
                <span> | </span>
              </template>
              <el-button
                @click.native.prevent="handleDetail(scope.row)"
                type="text"
                size="small">
                详情
              </el-button>
              <span> | </span>
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

    </section>


    <c-t-dialog
      :visible="visible"
      :title="title"
      confirmButtonText='保 存'
      width="680px"
      @confirm="handleConfirm"
      @close="handleClose"
    >
       <el-form label-width="120px" :model="recordInfo" ref="form" :rules="rules">
        <el-form-item 
          v-for="item in createOrEditForm"
          :key="item.key"
          :label="item.label"
          :prop="item.key"
        >
          <div v-if="item.type === 'div'" 
            :class="{
              'upload_wrap': item.key === 'upload',
            }"
          > 
            <template v-if="item.key === 'upload'">
              <c-upload-btn
                @change="handleImport"
                :imageLth="recordInfo.attachmentList && recordInfo.attachmentList.length"
                :videoLth="recordInfo.videoList && recordInfo.videoList.length"
              ></c-upload-btn>
              <div class="image_wrap" v-if="recordInfo.attachmentList && recordInfo.attachmentList.length > 0">
                <div v-for="(i,index) in recordInfo.attachmentList" :key="i" class="upload_item">
                  <img
                    :src="i" alt=""
                    class="img_style"
                  >
                  <i @click="deleteItem(index, 'image')" class="el-icon-error"></i>
                </div>
              </div>
              <div class="video_wrap" v-if="recordInfo.videoList && recordInfo.videoList.length > 0">
               <div v-for="(i,index) in recordInfo.videoList" :key="i" class="upload_item">     
                  <video 
                    :src="i"  
                    class="video_style"
                  ></video>
                  <i @click="deleteItem(index, 'video')" class="el-icon-error"></i>
                </div>
              </div>
            </template>
          </div>
          <component 
            v-else
            :is="item.type" 
            v-model="recordInfo[item.key]" 
            :type="item.childType ? item.childType : 'text'"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd HH:mm:ss"
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
      :visible="removeVisible"
      @confirm="removeConfirm"
      @close="removeClose"
    ></c-c-dialog> 

    <c-t-dialog
      :visible="taskDownVisible"
      title="任务下放"
      @confirm="taskDownConfirm"
      @close="taskDownClose"
    >
      <div>是否确认下放任务</div>
    </c-t-dialog>

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
        <el-button @click="handleRejectAduit">拒 绝</el-button>
      </span>
    </el-dialog>


    <c-t-dialog
      :visible="infoVisible"
      title="详情"
      width="680px"
      @confirm="infoClose"
      @close="infoClose"
    >
      <section class="info_wrap">
        <div v-for="item in createOrEditForm" :key="item.key">
          <div class="title">{{ item.label }}</div>
          <div class="value">
            <template v-if="item.key !== 'upload'">
              {{ recordInfo[item.key] }}
            </template>
            <template v-else>
              <div class="upload_wrap">
                <div class="image_wrap" v-if="recordInfo.attachmentList && recordInfo.attachmentList.length > 0">
                  <div v-for="(i,index) in recordInfo.attachmentList" :key="i" class="upload_item">
                    <img
                      :src="i" alt=""
                      class="img_style"
                    >
                  </div>
                </div>
                <div class="video_wrap" v-if="recordInfo.videoList && recordInfo.videoList.length > 0">
                <div v-for="(i,index) in recordInfo.videoList" :key="i" class="upload_item">     
                    <video 
                      :src="i"  
                      class="video_style"
                    ></video>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </c-t-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import CUploadBtn from '@/components/c-upload-btn'
export default {
  components: {
    CUploadBtn
  },
  data () {
    return {
      createOrEditForm: [
        { label: '走访时间', key: 'recordTime', type: 'el-date-picker', childType: 'date' },
        { label: '走访地点', key: 'address', type: 'el-input'},
        { label: '被走访人', key: 'visitName',  type: 'el-input' },
        { label: '思想评测', key: 'thoughtEvaluation', type: 'el-select', option: 'tEvaluationList' },
        // { label: '评价', key: 'evaluation', type: 'el-select', option: 'evaluationList'},
        { label: '走访情况', key: 'remark', type: 'el-input', childType: 'textarea'  },
        { label: "其他附件", key: 'upload', type: "div" , },
      ],
      rules: {
        recordTime: [{ required: true, message: '请选选择走访时间', trigger: 'blur' },],
        address: [{ required: true, message: '请输入走访地点', trigger: 'blur' },],
        visitName: [{ required: true, message: '请输入被走访人', trigger: 'blur' },],
        thoughtEvaluation: [{ required: true, message: '请选择思想评测', trigger: 'blur' },],
        // evaluation: [{ required: true, message: '请选择评价', trigger: 'blur' },],
        remark: [{ required: true, message: '请输入走访情况', trigger: 'blur' },],
      },

      tableHeader: [
        { property: 'recordTime', label: '走访时间', width: ''},
        { property: 'sysUserName', label: '走访民警', width: ''},
        { property: 'address', label: '走访地点', width: ''},
        { property: 'visitName', label: '被走访人', width: ''},
        { property: 'thoughtEvaluation', label: '思想评定', width: ''},
        { property: 'status', label: '状态', width: ''},
      ],
      pagination: {
        pageNo:1,
        pageSize: 10
      },
      showInfoList: [
        { key: "title1", label: "人员信息", type: "title"},
        { key: "name", label: "姓名"},
        { key: "idCard", label: "身份证号"},
        { key: "address", label: "户籍地"},
        { key: "residence", label: "居住地址"},
        { key: "phone", label: "手机号"},
        { key: "zone", label: "地域", custom: true},
        { key: "organizationType", label: "组织单位"},
        { key: "personnelType", label: "人员类别", custom: true},
        { key: "personnelLevel", label: "人员等级", custom: true},
        { key: "title2", label: "其他信息" , type: "title"},
        { key: "orgId", label: "管辖单位", custom: true},
        { key: "sysUserId", label: "责任民警", custom: true },
        { key: "visitFrequency", label: "走访频率", custom: true },
      ],
      visible: false,
      removeVisible: false,
      auditVisible: false,
      auditInfo: "",
      auditId: 0,
      title: '',
      infoVisible: false,

      optionlist: [
        { typeCode: "思想评测", key: "tEvaluationList"  },
        { typeCode: "评价", key: "evaluationList"  },
        { typeCode: "走访频率", key: "visitFrequencyList"  },
        { typeCode: "地域", key: "zoneList"  },
        { typeCode: "组织类别", key: "organTypeList"  },
        { typeCode: "人员类别", key: "personTypeList"  },
        { typeCode: "人员等级", key: "personLevelList"  },
      ],
      taskDownVisible: false,
    }
  },
  mounted() {
    this.init()
    this.searchFn()
  },
  computed: {
    ...mapState({
      itemInfo: state => state.personal.personalItem,
      list: state =>state.record.recordList,
      total: state =>state.record.recordListTotal,

      recordInfo: state => state.record.recordItem,
      statusMap : state => state.record.statusMap,

      tEvaluationList: state => state.tEvaluationList,
      evaluationList: state => state.evaluationList,

      psList: state => state.policeStationList,
      policeList: state => state.policeList,

      zoneList: state => state.zoneList,
      organTypeList: state => state.organTypeList,
      personTypeList: state => state.personTypeList,
      personLevelList: state => state.personLevelList,
      visitFrequencyList: state => state.visitFrequencyList,
    })
  },
  methods: {
    ...mapActions([
      'getPersonalDetailAction',
      'getRecordListAction',
      'createOrUpdateRecordAction',
      'removeRecordAction',
      'auditRecordAction',
      'getRecordDetailAction',
      'commonUploadAction',
      'getDicItemsAction',
      'taskDownAction',
      'getPoliceStationListAction',
      'getPoliceListAction'
    ]),
    ...mapMutations([
      'RECORD_ITEM_UPDATE',
      'SET'
    ]),
    showValueMap (type, id) {
      let arr
      switch (type) {
        case 'zone':
          arr = this.zoneList
          break;
        case 'personnelType':
          arr = this.personTypeList
          break;
        case 'personnelLevel':
          arr = this.personLevelList
          break;
        case 'orgId':
          arr = this.psList
          break;
        case 'sysUserId':
          arr = this.policeList
          break;
        case 'visitFrequency':
          arr = this.visitFrequencyList
          break;
        default:
          arr = []
          break;
      }
      const item = arr.find(item => item.id === id) || {}
      return item.name
    },
    handleBack () {
      this.$router.go(-1)
    },
    handleTaskDistribution () {
      this.taskDownVisible = true
    },
    taskDownConfirm () {
      const { id } = this.$route.query
      this.taskDownAction(id)
        .then(res => {
          this.taskDownClose()
        }).catch(err => console.log(err))
    },
    taskDownClose () {
      this.taskDownVisible  = false
    },
    handlePrint () {},
    handleHeaderEdit () {
      const { id } = this.$route.query
      this.$router.push({ 
        name: "EmphasisPersonalEdit",
        query: { id }
      })
    },
    // computedFormat(url) {
    //   const imgPattern =  /\.(jpg|png|gif|jpeg)$/;
    //   const videoPattern = /\.(mp4|avi|wmv|mov|mpeg|mpg|rm|ram|swf|flv)$/;

    //   if(imgPattern.test(url)) return 'img'
    //   else if(videoPattern.test(url)) return 'video'
    // },
    deleteItem (index, type) {
      this.RECORD_ITEM_UPDATE({index, type})
    },
    init () {
      const { id } = this.$route.query
      this.getPersonalDetailAction(id)
        .then(res => {
          this.getPoliceListAction(res.orgId)
        })
        .catch(err => console.log(err))
    
      this.optionlist.forEach(item => {
        this.getDicItemsAction(item)
          .catch(err => console.log(err))
      })

      this.getPoliceStationListAction()
        .catch(err => console.log(err))      
    },
    searchFn () {
      const { id } = this.$route.query
      this.getRecordListAction({ 
        ...this.pagination,
        id, 
        type: "person" 
      })
        .catch(err => console.log(err))
    },
    computedOption (option) {
      switch (option) {
        case 'tEvaluationList' : return this.tEvaluationList;
        case 'evaluationList' : return this.evaluationList;
        default: return [];
      }
    },
    handleImport ({event, type}) {
      const files = event.target.files
      console.log('files', files)
      if(files.length === 0) { 
        return 
      }else if (files[0].type.split('/')[0] !== type) { 
        this.$message.error('文件格式错误');
        return
      }else if (files[0].type.split('/')[0] === 'video' && files[0].size > 2000000) {
        this.$message.error('文件大小超出');
        return
      }
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.commonUploadAction(formData)
        .then(res => {
          this.RECORD_ITEM_UPDATE({ file: res, type })
        })
        .catch(err => this.$message.error('上传失败' + err))
    },
    handleCreate () {
      this.visible = true
      this.title = '创建'
    },
    handleConfirm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const joinId = this.$route.query.id
          this.createOrUpdateRecordAction({
            ...this.recordInfo,
            joinId,
            type: "person"
          })
            .then(res => {
              this.handleClose()
              this.$message.success(this.recordInfo.id ? '修改成功!':'修改成功！')
              this.searchFn()
            })
            .catch(err => this.$message.error(this.recordInfo.id ? '修改失败！'+ err  : '创建失败！' + err))
        } else {
          this.$message.error('请输入全部信息后，提交!')
          return false;
        }
      })
    },
    handleClose () {
      this.SET({ module: "record", key: "recordItem", value: {
        attachmentList:[],
        videoList: []
      }})
      this.title = ''
      this.visible = false
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.searchFn()
    },
    handleCurrentChange (val) {
      this.pagination.pageNo = val
      this.searchFn()  
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
      this.auditRecordAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.searchFn()
        })
        .catch(err => this.$message.error(err))
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
      this.auditRecordAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.searchFn()
        })
        .catch(err => this.$message.error(err))
    },
    handleEvaluate (row) {

    },

    handleDetail (row) {
      this.getRecordDetailAction({ id: row.id, type: "person"})
        .then(_ =>  this.infoVisible = true )
    },
    infoClose () {
      this.infoVisible = false
    },

    handleEdit (row) {
      this.getRecordDetailAction({ id: row.id, type: "person"})
        .then(res => {
          this.visible = true
          this.title = '编辑'
        })
    },
    handleRemove (row) {
      this.removeId =  row.id
      this.removeVisible = true
    },
    removeClose () {
      this.removeVisible = false
    },
    removeConfirm () {
      if(this.removeId !== 0) {
        this.removeRecordAction(this.removeId)
          .then(_ => {
            this.removeVisible = false
            this.searchFn()
          })
      }
    },
  }
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom_info.scss';

  .upload_wrap {
    .image_wrap,
    .video_wrap {
      margin-top: 10px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .upload_item {
        margin-right: 20px;
        position: relative;
        .img_style{
          width: 80px;
          height: 80px;
        }
        .video_style {
          width: 120px;
          height: 80px;
        }
        i {
          cursor: pointer;
          position: absolute;
          right: 10px;
          top: 10px;
        }
      }
    }
  }

  .info_wrap {
    display: flex;
    flex-direction: column;
    > div {
      display: flex;
      min-height: 34px;
      margin-bottom: 10px;
      > div:nth-child(1) {
        flex-basis: 100px;
        flex-shrink: 0;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
</style>