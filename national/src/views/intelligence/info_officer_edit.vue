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
        ref="infoOfficerForm"
      >
        <el-form-item
          v-for="item in createOrEditForm" 
          :key="item.key" 
          :label="item.label"
          :prop="item.key"
          :class="item.className"
        >
          <div v-if="item.type==='div'">{{ item.context }}</div>
          <component 
            v-else
            :is="item.type" 
            v-model="itemInfo[item.key]" 
            @change="handleChange(item.key, itemInfo[item.key])"
          >            
            <template v-if="item.option && (item.key === 'orgId' || item.key === 'sysUserId')">
              <el-option 
                v-for="cur in computedList(item.option)"
                :key="cur.id"
                :label="cur.name"
                :value="cur.id"
              />
            </template>

            <template v-else-if="item.option && item.key === 'useType'">
              <el-option 
                v-for="cur in computedList(item.option)"
                :key="cur.id"
                :label="cur.name"
                :value="cur.name"
              />
            </template>
          </component>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex'
export default {
  data () {
    return {
      createOrEditForm: [
        { key: 'title', type: "div" , className: "title", context: "信息员信息:" },
        { label: '信息员代号', key: 'personNo', type: 'el-input' },
        { label: '使用方向', key: 'useType', type: 'el-select', option: "useDirList" },
        { label: '所属派出所', key: 'orgId',  type: 'el-select', option: "psList", },
        { label: '责任民警', key: 'sysUserId', type: 'el-select', option: "policeList" },
      ],
      rules: {
        personNo: [{ required: true, message: '请输入信息员代号', trigger: 'blur' },],
        useType: [{ required: true, message: '请选择使用方向', trigger: 'blur' },],
        orgId: [{ required: true, message: '请选择所属派出所', trigger: 'blur' },],
        sysUserId: [{ required: true, message: '请选择责任民警', trigger: 'blur' },],
      }
    }
  },
  computed: {
    ...mapState({
      itemInfo: state => state.infoOfficer.infoOfficerItem,
      psList: state => state.policeStationList,
      policeList: state => state.policeList,
      useDirList: state => state.useDirectionList,
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'createOrUpdateInfoOfficerAction',
      'getInfoOfficerDetailAction',
      'getPoliceListAction',
      'getPoliceStationListAction',
      'getDicItemsAction',      
    ]),
    init () {
      const { id } = this.$route.query
      if(id) {
        this.getInfoOfficerDetailAction(id)
          .catch(err => console.log(err))
      }

      if(this.psList.length === 0) {
        this.getPoliceStationListAction()
          .catch(err => console.log(err))

      }
      if(this.useDirList.length === 0 ) {
        this.getDicItemsAction({ typeCode: "使用方向", key: "useDirectionList"  })
          .catch(err => console.log(err))
      }
    },
    computedList (option) {
      switch (option) {
        case 'psList': return this.psList;
        case 'policeList': return this.policeList;
        case 'useDirList': return this.useDirList;
        default: return [];
      }
    },
    handleChange (key, orgId) {
      if (key === 'orgId' && orgId !== '') {
        this.getPoliceListAction(orgId)
          .catch(err => console.log(err))
      }
    },
    handleBack () {
      this.$router.go(-1)
    },
    handleSubmit () {
      this.$refs['infoOfficerForm'].validate((valid) => {
        if (valid) {

          const deptName = (this.psList.find(item => item.id === this.itemInfo.orgId) || {}).name
          const sysUserName = (this.policeList.find(item => item.id === this.itemInfo.sysUserId) || {}).name

          this.createOrUpdateInfoOfficerAction({
            ...this.itemInfo,
            deptName,
            sysUserName
          })
            .then(res => this.$message.success(this.itemInfo.id ?'修改成功!' : '创建成功！'))
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
</style>