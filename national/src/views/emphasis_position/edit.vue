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
        ref="form"
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
        { key: 'title1', type: "div" , className: "title", context: "信息员信息:" },
        { label: '阵地名称', key: 'name', type: 'el-input' },
        { label: '种类', key: 'type', type: 'el-select', option: "typeList" },
        { label: '登记证号', key: 'cardNo',  type: 'el-input' },
        { label: '管理负责人', key: 'owner', type: 'el-input' },
        { label: '地址', key: 'address', type: 'el-input'},
        { label: '管辖单位', key: 'orgId', type: 'el-select', option: "psList" },
        { label: '责任民警', key: 'sysUserId', type: 'el-select', option: "policeList" },
        { label: '走访频率', key: 'visitFrequency', type: 'el-select', option: "visitFrequencyList" },
      ],
      rules: {
        orgId: [{ required: true, message: '请选择所属派出所', trigger: 'blur' },],
        sysUserId: [{ required: true, message: '请选择责任民警', trigger: 'blur' },],
        name: [{ required: true, message: '请输入阵地名称', trigger: 'blur' },],
        type: [{ required: true, message: '请选择种类', trigger: 'blur' },],
        cardNo: [{ required: true, message: '请输入登记证号', trigger: 'blur' },],
        owner: [{ required: true, message: '请输入管理负责人', trigger: 'blur' },],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' },],
        visitFrequency: [{ required: true, message: '请选择走访频率', trigger: 'blur' },],
      }
    }
  },
  computed: {
    ...mapState({
      itemInfo: state => state.position.positionItem,
      psList: state => state.policeStationList,
      policeList: state => state.policeList,

      visitFrequencyList: state => state.visitFrequencyList,
      typeList: state => state.typeList
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'createOrUpdatePositionAction',
      'getPositionDetailAction',

      'getPoliceListAction',
      'getPoliceStationListAction',
      'getDicItemsAction'
    ]),
    init () {
      const { id } = this.$route.query
      if(id) {
        this.getPositionDetailAction(id)
          .catch(err => console.log(err))
      }

      if(this.psList.length === 0) {
        this.getPoliceStationListAction()
          .catch(err => console.log(err))
      }

      this.getDicItemsAction({ typeCode: "重点阵地种类", key: "typeList"  })
        .catch(err => console.log(err))
    
      this.getDicItemsAction({ typeCode: "走访频率", key: "visitFrequencyList"  })
        .catch(err => console.log(err))

    },
    computedList (option) {
      switch (option) {
        case 'psList': return this.psList;
        case 'policeList': return this.policeList;
        case 'visitFrequencyList': return this.visitFrequencyList;
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.createOrUpdatePositionAction(this.itemInfo)
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