<template>
  <div class="c_edit_wrap">
    <header class="c_edit_header">
      <div @click="handleBack" class="back">
        <i class="el-icon-arrow-left"></i>
        返回
      </div>
      
      <c-button round iconType="ic_tijiao" @click="handleSubmit">
        <span>提交</span>
      </c-button>

    </header>
    <section class="c_edit_body">
      <el-form 
        label-width="120px"
        :rules="rules"
        :model="itemInfo"
        ref="infoSubmitForm"
      >
        <el-form-item
          v-for="item in createOrEditForm" 
          :key="item.key" 
          :label="item.label"
          :prop="item.key"
          v-if="!item.inithide"
          :class="item.className"
        >
          <div v-if="item.type === 'div'" 
            :ref="item.ref" 
            :class="{
              'upload_wrap': item.key === 'upload',
              'editor_ref': item.key === 'editor'
            }"
          > 
            <template v-if="item.context">{{ item.context }}</template>
            <template v-else-if="item.key === 'upload'">
              <template v-if="itemInfo.attachmentList && itemInfo.attachmentList.length > 0">
                <div v-for="i in itemInfo.attachmentList" :key="i" class="upload_item">
                  <el-tooltip  effect="dark" :content="i" placement="top-start">
                    <a :href="i">
                      <i class="el-icon-document-copy file_style"></i>
                    </a>
                  </el-tooltip>
                </div>
              </template>
              <c-button flat iconType="daochu" class="file_upload_button">
                <span>上传附件 <input type="file" @change="handleImport($event)"></span>
              </c-button>
            </template>
          </div>
          <component 
            v-else
            :is="item.type"
            v-model="itemInfo[item.key]" 
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleChange(item.key, itemInfo[item.key])"
          >            
            <template v-if="item.option && item.key === 'infoSource'">
              <el-option 
                v-for="cur in computedList(item.option)"
                :key="cur"
                :label="cur"
                :value="cur"
              />
            </template>
            <template v-else-if="item.option">
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
    </section>
  </div>
</template>

<script>
import { mapState,mapActions, mapMutations } from 'vuex'
import wangEditor from 'wangeditor'
export default {
  data () {
    return {
      editor: null,
      editorData: '',
      createOrEditForm: [
        { key: 'title1', type: "div" , className: "title", context: "基础信息:" },
        { label: '信息来源', key: 'infoSource', type: 'el-select', option: 'infoSourceList'},
        { label: '信息员编号', key: 'personNo', type: 'el-input' , inithide: true},
        { label: '情报编号', key: 'infoNo', type: 'el-input' },
        { label: '是否录用', key: 'employed', type: 'el-select', option: "employedList" },
        // { label: '上报人', key: 'sysUserId',  type: 'el-select', option: "policeList", },
        // { label: '上报时间', key: 'reportTime', type: 'el-date-picker', datePickerType: 'date' },
        // { label: '上报单位', key: 'orgId', type: 'el-select', option: "psList" },
        { key: 'title2', type: "div" , className: "title", context: "情报信息:" },
        { label: '情报标题', key: 'title', type: 'el-input' },
        { label: "情报正文", key: 'editor', type: "div" , ref: "editor", className: "editor" },
        { label: "文件上传", key: 'upload', type: "div" , },
      ],
      rules: {
        infoSource: [{ required: true, message: '请选择信息来源', trigger: 'blur' },],
        personNo: [{ required: true, message: '请输入信息员编号', trigger: 'blur' },],
        infoNo: [{ required: true, message: '请输入情报编号', trigger: 'blur' },],
        sysUserId: [{ required: true, message: '请选择上报人', trigger: 'blur' },],
        reportTime: [{ required: true, message: '请选择上报时间', trigger: 'blur' },],
        orgId: [{ required: true, message: '请选择上报单位', trigger: 'blur' },],
        title: [{required: true, message: '请输入情报标题', trigger: 'blur' }]
      },
    }
  },
  computed: {
    ...mapState({
      itemInfo: state => state.infoSubmit.infoSubmitItem,
      psList: state => state.policeStationList,
      policeList: state => state.policeList,
      infoSourceList: state => state.infoSourceList,
      employedList: state => state.employedList
    }),
  },
  mounted() {
    this.init()
    this.initEditor()
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  methods: {
    ...mapActions([
      'getPoliceListAction',
      'getPoliceStationListAction',
      'createOrUpdateInfoSubmitAction',
      'getInfoSubmitDetailAction',

      'commonUploadAction',
      'getDicItemsAction'
    ]),
    ...mapMutations([
      'SET_INFO_SUBMIT_ITEM_ATTCH'
    ]),
    initEditor () {
      const editor = new wangEditor(this.$refs['editor'])
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.editorData = newHtml
      }
      // 创建编辑器
      editor.create()
      this.editor = editor
    },
    init () {
      const { id } = this.$route.query
      if(id) {
        this.getInfoSubmitDetailAction(id)
          .then(res => {
            if(res.infoSource === "情报员上报") {
              this.createOrEditForm.splice(2,1,{ 
                label: '信息员编号', 
                key: 'personNo', 
                type: 'el-input'})
            }
            this.editor.txt.html(this.itemInfo.infoBody) 
          })
          .catch(err => console.log(err))
      }
      if(this.psList.length === 0) {
        this.getPoliceStationListAction()
          .catch(err => console.log(err))
      }

      this.getDicItemsAction({ typeCode: "信息来源", key: "infoSourceList"  })
        .catch(err => console.log(err))
    },
    computedList (option) {
      switch (option) {
        case 'psList': return this.psList;
        case 'policeList': return this.policeList;
        case 'infoSourceList': return this.infoSourceList.map(item => item.name)
        case 'employedList': return this.employedList
        default: return [];
      }
    },
    handleImport (event) {
      if(event.target.files.length === 0) { return }
      const formData = new FormData()
      formData.append('file', event.target.files[0])
      this.commonUploadAction(formData)
        .then(res => {
          console.log('res', res)
          this.SET_INFO_SUBMIT_ITEM_ATTCH(res)
          this.$forceUpdate()
        })
        .catch(err => this.$message.error('上传失败' + err))
    },
    handleChange (key, id) {
      if (key === 'orgId' && id !== '') {
        this.getPoliceListAction(id)
          .catch(err => console.log(err))
      }

      if(key === 'infoSource' && id !== '') {
        const name = (this.infoSourceList.find(item => item.id === id) || {}).name
        console.log(name)
        if(name === '情报员上报'){
          this.createOrEditForm.splice(2,1, 
            { label: '信息员编号', key: 'personNo', type: 'el-input'})
        } else if (name === '非情报员上报') {
          this.createOrEditForm.splice(2,1, 
            { label: '信息员编号', key: 'personNo', type: 'el-input' , inithide: true})
        }
      }
    },
    handleBack () {
      this.$router.go(-1)
    },
    handleSubmit () {
      this.$refs['infoSubmitForm'].validate((valid) => {
        if (valid) {

          const deptName = (this.psList.find(item => item.id === this.itemInfo.orgId) || {}).name
          const sysUserName = (this.policeList.find(item => item.id === this.itemInfo.sysUserId) || {}).name
          // const infoSource = (this.infoSourceList.find(item => item.id === this.itemInfo.infoSource) || {}).name

          this.createOrUpdateInfoSubmitAction({
            ...this.itemInfo,
            infoBody: this.editorData || "",
            deptName,
            sysUserName,
            // infoSource
          })
            .then(res => {
              this.$message.success(this.itemInfo.id ?'修改成功!' : '创建成功！')
              this.$router.go(-1)
            })
            .catch(err => this.$message.error(this.itemInfo.id ?'修改失败!' : '创建失败！'))
        } else {
          return false;
        }
      })
    }
  }

}

</script>
<style lang="scss" scoped>
 @import '@/assets/style/custom_edit.scss';
 @import '@/assets/style/file_upload_button.scss';

  ::v-deep .el-date-editor.el-input, 
  ::v-deep .el-date-editor.el-input__inner {
    width: 100% !important;
  }

  .el-form-item.editor {
    width: 100% !important;
    .editor_ref {
      position: relative;
      z-index: 1;
    }
  }

  .upload_wrap {
    display: flex;
    align-items: center;
    .upload_item {
      margin-right: 20px;
      .file_style {
        font-size: 40px;
        color: #909399;
      }
    }
  }
</style>