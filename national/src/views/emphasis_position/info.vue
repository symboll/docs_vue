<template>
  <div class="c_wrap">
    <header class="c_header">
      <div @click="handleBack" class="back">
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      <div class="c_header_btn_wrap">

        <c-button
          round iconType="ic_bianji"  @click="handleHeaderEdit">
          <span>编辑</span>
        </c-button>
      </div>
    </header>

    <section class="c_body">
      <!-- <div class="title">阵地信息</div> -->
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
            v-if="itemInfo.status == 'finish' || itemInfo.status == 'close'|| itemInfo.status == 'close_fail'"
            flat iconType="ic_xinzeng" @click="handleCreate"
          >
            <span >新增</span>
          </c-button>
        </div>
      </section>
      <section class="c_table_body">
        <el-table
          class="c_table"
          :data="list"
          highlight-current-row
          height="610"
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
                <template v-if="item.property ==='recordTime'">
                  <span> {{ timeMap(scope.row['recordTime']) }}</span>
                </template>
                <template v-else-if="item.property ==='status'">
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
              <template v-if="buttonList('position').includes('exportWord')">
                <template v-if="scope.row.status === 'finish' || scope.row.status === 'evaluation'">
                  <el-button
                    @click.native.prevent="handleExport(scope.row)"
                    type="text"
                    size="small">
                    导出
                  </el-button>
                  <span> | </span>
                </template>
              </template>
              <template v-if="scope.row.status === 'init' && buttonList('Record').includes('audit')">
                <el-button
                  @click.native.prevent="handleAudit(scope.row)"
                  type="text"
                  size="small">
                  审核
                </el-button>
                <span> | </span>
              </template>
              <template v-if="currentUser.userType === 1 && scope.row.status === 'finish'">
                <el-button
                  @click.native.prevent="handleEvaluate(scope.row) && buttonList('Record').includes('evaluate')"
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
              <div class="tip_wrap">
                <c-upload-btn
                  @change="handleImport"
                  :imageLth="recordInfo.attachmentList && recordInfo.attachmentList.length"
                  :videoLth="recordInfo.videoList && recordInfo.videoList.length"
                ></c-upload-btn>
                <div class="tip">被走访人需与走访民警同框</div>
              </div>
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
            :placeholder="item.placeholder"
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
                      @click="handleClick('image', i)"
                    >
                  </div>
                </div>
                <div class="video_wrap" v-if="recordInfo.videoList && recordInfo.videoList.length > 0">
                <div v-for="(i,index) in recordInfo.videoList" :key="i" class="upload_item">     
                    <video 
                      :src="i"  
                      class="video_style"
                      @click="handleClick('video',i)"
                    ></video>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </c-t-dialog>

    <c-t-dialog
      :visible="viewVisible"
      :title="viewType === 'video'? '查看视频': '查看图片'"
      :width="viewType === 'video'? '520px': '360px' "
      @confirm="viewClose"
      @close="viewClose"
    >
      <template v-if="viewType === 'video'">
        <video class="big_video" :src="viewUrl" controls autoplay></video>
      </template>
      <template v-else>
        <img class="big_image" :src="viewUrl" alt="">
      </template>
    </c-t-dialog>

    <c-t-dialog
      :visible="evaluateVisable"
      title="评价"
      @confirm="evaluateConfirm"
      @close="evaluateClose"
    >
      <el-select v-model="evaluateValue" @change="evaluateChange">
        <el-option 
          v-for="item in evaluationList" 
          :key="item.id"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
    </c-t-dialog>
    
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import CUploadBtn from '@/components/c-upload-btn'
import { baseURL } from '../../config/index.js'
import { getToken } from '../../lib/util.js'
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
        { label: '场所情况评估', key: 'thoughtEvaluation', type: 'el-select', option: 'tEvaluationList' },
        // { label: '评价', key: 'evaluation', type: 'el-select', option: 'evaluationList'},
        { label: '走访情况', key: 'remark', type: 'el-input', childType: 'textarea',  placeholder: '经走访，该场所/人员情况评定为…..' },
        { label: "其他附件", key: 'upload', type: "div" , },
      ],
      rules: {
        recordTime: [{ required: true, message: '请选选择走访时间', trigger: 'blur' },],
        address: [{ required: true, message: '请输入走访地点', trigger: 'blur' },],
        visitName: [{ required: true, message: '请输入被走访人', trigger: 'blur' },],
        thoughtEvaluation: [{ required: true, message: '请选择场所情况评估', trigger: 'blur' },],
        evaluation: [{ required: true, message: '请选择评价', trigger: 'blur' },],
        remark: [{ required: true, message: '请输入走访情况', trigger: 'blur' },],
      },

      tableHeader: [
        { property: 'recordTime', label: '走访时间', width: ''},
        { property: 'sysUserName', label: '走访民警', width: ''},
        { property: 'address', label: '走访地点', width: ''},
        { property: 'visitName', label: '被走访人', width: ''},
        { property: 'thoughtEvaluation', label: '场所情况评估', width: ''},
        { property: 'status', label: '状态', width: ''},
      ],
      pagination: {
        pageNo:1,
        pageSize: 10
      },
      showInfoList: [
        { key: "title", label: "阵地信息", type: "title"},
        { key: "name", label: "阵地名称" },
        { key: "type", label: "种类" },
        { key: "cardNo", label: "登记证号" },
        { key: "owner", label: "管理负责人" },
        { key: "address", label: "地址" },
        { key: "orgId", label: "管辖单位", custom: true },
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
        { typeCode: "场所情况评估", key: "tEvaluationList"  },
        { typeCode: "评价", key: "evaluationList"  },
        { typeCode: "走访频率", key: "visitFrequencyList"  },
      ],
      viewVisible: false,
      viewUrl:'',
      viewType: '',

      evaluateVisable: false,
      evaluateId: '',
      evaluateValue: ''
    }
  },
  mounted() {
    this.init()
    this.searchFn()
  },
  computed: {
    ...mapState({
      itemInfo: state => state.position.positionItem,
      list: state =>state.record.recordList,
      total: state =>state.record.recordListTotal,

      recordInfo: state => state.record.recordItem,
      statusMap : state => state.record.statusMap,

      tEvaluationList: state => state.tEvaluationList,
      evaluationList: state => state.evaluationList,
      visitFrequencyList: state => state.visitFrequencyList,

      psList: state => state.policeStationList,
      policeList: state => state.policeList,
      currentUser: state => state.user.currentUser
    }),
    ...mapGetters([
      'buttonList'
    ])
  },
  methods: {
    ...mapActions([
      'getPositionDetailAction',
      'getRecordListAction',
      'createOrUpdateRecordAction',
      'removeRecordAction',
      'auditRecordAction',
      'getRecordDetailAction',
      'commonUploadAction',
      'getDicItemsAction',
      'getPoliceListAction',
      'getPoliceStationListAction',
      'evaluationAction'
    ]),
    ...mapMutations([
      'RECORD_ITEM_UPDATE',
      'SET'
    ]),
    // computedFormat(url) {
    //   const imgPattern =  /\.(jpg|png|gif|jpeg)$/;
    //   const videoPattern = /\.(mp4|avi|wmv|mov|mpeg|mpg|rm|ram|swf|flv)$/;

    //   if(imgPattern.test(url)) return 'img'
    //   else if(videoPattern.test(url)) return 'video'
    // },
    timeMap (time='') {
      const t = time.split(' ')[0]
      return t
    },
    viewClose () {
      this.viewType = ''
      this.viewVisible = false
    },
    handleClick (type, url) {
      this.viewType = type
      this.viewVisible = true
      this.viewUrl = url
    },
    handleBack () {
      this.$router.go(-1)
    },
    handleHeaderEdit () {
      const { id } = this.$route.query
      this.$router.push({ 
        name: "EmphasisPositionEdit",
        query: { id }
      })
    },
    showValueMap (type, id) {
      let arr  = []
      switch (type) {
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
    deleteItem (index, type) {
      this.RECORD_ITEM_UPDATE({index, type})
    },
    init () {
      const { id } = this.$route.query
      this.getPositionDetailAction(id)
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
        type: "position" 
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
      }
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.commonUploadAction(formData)
        .then(res => {
          this.RECORD_ITEM_UPDATE({ file: res, type })
        })
        .catch(err => this.$message.error('上传失败' + err))
    },
    // handleImport (event) {
    //   if(event.target.files.length === 0) { return }
    //   const formData = new FormData()
    //   formData.append('file', event.target.files[0])
    //   this.commonUploadAction(formData)
    //     .then(res => this.SET_RECORD_ITEM_ATTCH(res))
    //     .catch(err => this.$message.error('上传失败' + err))
    // },
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
            type: "position"
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
    handleExport (row) {
      window.location.href = `${baseURL}/api/record/v1/exportWord/${row.id}?Authorization=${getToken()}`
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
      this.auditRecordAction(param)
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
      this.auditRecordAction(param)
        .then(_ => {
          this.auditInfo = ''
          this.auditId = 0
          this.auditVisible = false
          this.searchFn()
        })
        .catch(err => console.log(err))
    },
    handleEvaluate (row) {
      this.evaluateId = row.id
      this.evaluateVisable = true
    },
    evaluateChange (event) {
      this.evaluateValue = event
    },
    evaluateConfirm () {
      if(this.evaluateValue === '') {
        this.$message.error('请选择评价')
        return
      }else {
        const params = {
          evaluation: this.evaluateValue,
          id: this.evaluateId,
          type: "position"
        }
        this.evaluationAction(params)
          .then(res => {
            this.evaluateClose()
            this.searchFn()
          })
          .catch(err => this.$message.error(err))
      }
    },
    evaluateClose () {
      this.evaluateId = ''
      this.evaluateVisable = false
    },

    handleDetail (row) {
      this.getRecordDetailAction({ id: row.id, type: "position"})
        .then(_ =>  this.infoVisible = true )
    },
    infoClose () {
      this.infoVisible = false
      this.SET({ module: "record", key: "recordItem", value: {} })
    },

    handleEdit (row) {
      this.getRecordDetailAction({ id: row.id, type: "position"})
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
  .c_table_body {
    height: calc(100vh - 345px) !important;
  }
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
.big_image {
  width: 320px;
  height: 320px;
}
.big_video {
  width: 480px;
  height: 320px;
}
.tip_wrap {
  display: flex;
  .tip {
    color: #ccc;
    margin-left: 20px;
  }
}
</style>