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
          <div v-if="item.type === 'div'">{{ item.context }}</div>
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
        { key: 'title1', type: "div" , className: "title", context: "人员信息:" },
        { label: '姓名', key: 'name', type: 'el-input' },
        { label: '身份证号', key: 'idCard', type: 'el-input' },
        { label: '户籍地', key: 'address', type: 'el-input' },
        { label: '居住地址', key: 'residence', type: 'el-input' },
        { label: '手机号', key: 'phone', type: 'el-input' },
        { label: '地域', key: 'zone', type: 'el-select', option: "zoneList" },
        { label: '组织类别', key: 'organizationType', type: 'el-select', option: "organTypeList" },
        { label: '人员类别', key: 'personnelType', type: 'el-select', option: "personTypeList" },
        { label: '人员等级', key: 'personnelLevel', type: 'el-select' , option: "personLevelList"},
        { key: 'title2', type: "div" , className: "title", context: "其他信息:" },
        { label: '管辖单位', key: 'orgId', type: 'el-select', option: "psList" },
        { label: '责任民警', key: 'sysUserId', type: 'el-select', option: "policeList" },
        { label: '走访频率', key: 'visitFrequency', type: 'el-select', option: "visitFrequencyList" },
      ],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' },],
        idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' },],
        address: [{ required: true, message: '请输入户籍地', trigger: 'blur' },],
        residence: [{ required: true, message: '请输入居住地址', trigger: 'blur' },],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' },],
        zone: [{ required: true, message: '请选择地域', trigger: 'blur' },],
        organizationType :[{ required: true, message: '请选择组织类别', trigger: 'blur' },],
        personnelType: [{ required: true, message: '请选择人员类别', trigger: 'blur' },],
        personnelLevel :[{ required: true, message: '请选择人员等级', trigger: 'blur' },],
        orgId: [{ required: true, message: '请选择管辖单位', trigger: 'blur' },],
        sysUserId: [{ required: true, message: '请选择责任民警', trigger: 'blur' },],
        visitFrequency: [{ required: true, message: '请选择走访频率', trigger: 'blur' },],
      },
      list: [
        { typeCode: "走访频率", key: "visitFrequencyList"  },
        { typeCode: "地域", key: "zoneList"  },
        { typeCode: "组织类别", key: "organTypeList"  },
        { typeCode: "人员类别", key: "personTypeList"  },
        { typeCode: "人员等级", key: "personLevelList"  },
      ]
    }
  },
  computed: {
    ...mapState({
      itemInfo: state => state.position.positionItem,
      psList: state => state.policeStationList,
      policeList: state => state.policeList,

      zoneList: state => state.zoneList,
      organTypeList: state => state.organTypeList,
      personTypeList: state => state.personTypeList,
      personLevelList: state => state.personLevelList,
      visitFrequencyList: state => state.visitFrequencyList,

    })
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'createOrUpdatePersonalAction',
      'getPersonalDetailAction',

      'getPoliceListAction',
      'getPoliceStationListAction',
      'getDicItemsAction'
    ]),
    init () {
      const { id } = this.$route.query
      if(id) {
        this.getPersonalDetailAction(id)
          .catch(err => console.log(err))
      }

      if(this.psList.length === 0) {
        this.getPoliceStationListAction()
          .catch(err => console.log(err))
      }
    

      // this.getDicItemsAction({ typeCode: "走访频率", key: "visitFrequencyList"  })
      //   .catch(err => console.log(err))
      this.list.forEach(item => {
        this.getDicItemsAction(item)
          .catch(err => console.log(err))
      })
    },
    computedList (option) {
      switch (option) {
        case 'psList': return this.psList;
        case 'policeList': return this.policeList;
        case 'visitFrequencyList': return this.visitFrequencyList;
        case 'zoneList': return this.zoneList;
        case 'organTypeList': return this.organTypeList;
        case 'personTypeList': return this.personTypeList;
        case 'personLevelList': return this.personLevelList;

        default: return [];
      }
    },
    handleChange (key, value) {
      if (key === 'orgId' && value !== '') {
        this.getPoliceListAction(value)
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

          this.createOrUpdatePersonalAction({
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