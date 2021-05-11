<template>
  <div class="search_wrap">
    <div class="search_input">
      <el-form label-width="120px" >
        <el-form-item
          v-for="item in searchList" 
          :key="item.key" 
          :class="{
            'form_item_time': item.key=== 'time'
          }"
          :label="item.label">
          <component 
            :is="item.type" 
            v-model="item.value" 
            :type="item.datePickerType" 
            :format="item.format ? item.format:'yyyy 年 MM 月 dd 日'"
            :value-format="item.valueFormat ? item.valueFormat: 'yyyy-MM-dd'"
            :clearable="item.clearable"
            @change="handleChange(item.key,item.value)"
          >
            <template v-if="item.option && (
              item.key === 'orgId' || 
              item.key === 'sysUserId' ||
              item.key === 'deptName' ||
              item.key === 'owner'
            )">
              <el-option 
                v-for="cur in computedList(item.option)"
                :key="cur.id"
                :label="cur.name"
                :value="cur.id"
              />
            </template>

            <template v-if="item.option && item.key === 'useType'">
              <el-option 
                v-for="cur in computedList(item.option)"
                :key="cur.id"
                :label="cur.name"
                :value="cur.name"
              />
            </template>

            <template v-if="item.option && (item.key === 'status'  || item.key === 'taskType')">
              <el-option 
                v-for="cur in computedList(item.option)"
                :key="cur.id"
                :label="cur.label"
                :value="cur.id"
              />
            </template>
          </component>
        </el-form-item>
      </el-form>
    </div>
    <div class="search_btn">
      <c-button icon iconType='ic_Search' @click="handleSearch"/>
      <c-button icon iconType="ic_chognzhi" type="info" :rotate="rotate"  @click="handleReset" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      rotate: false,
    }
  },
  props: {
    searchList: {
      type: Array,
      default: () => []
    },
    psList: {
      type: Array,
      default: () => []
    },
    policeList: {
      type: Array,
      default: () => []
    },
    useDirList: {
      type: Array,
      default: () => []
    },
    statusList: {
      type: Array,
      default: () => []
    },
    taskTypeList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    ...mapMutations([
      'COMMIT_SET'
    ]),
    computedList (option) {
      switch (option) {
        case 'psList': return this.psList;
        case 'policeList': return this.policeList;
        case 'useDirList': return this.useDirList;
        case 'statusList': return this.statusList;
        case "taskTypeList": return this.taskTypeList;
        default: return [];
      }
    },
    handleChange (key, value) {
      if ((key === 'orgId' || key==='deptName') && value !== '') {
        this.$emit('policeStationChange', value)
      }
    },
    handleSearch () {
      const map = {}
      this.searchList.forEach(item => {
        if(item.value !== '') {
          map[item.key] = item.value
        }
      })
      this.$emit('search', map)
    },
    handleReset (){
      this.rotate = true
      this.searchList.forEach(item => {
        item.value = ''
      })
      this.COMMIT_SET({ key: "policeList", value: [] })
      setTimeout(()=> { this.rotate = false }, 300)
      this.$emit('search', {})
    }
  }
  
}

</script>
<style lang="scss" scoped>
.search_wrap{
  display: flex;
  .search_input{
    flex: 1;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 25%;
        min-width: 320px;
        .el-select {
          width: 100%;
        }
      }
    }
  }
  .form_item_time {
    width: 50% !important;
    .el-range-editor--small.el-input__inner {
      width: 100%;
    }
  }
  .search_btn{
    display: flex;
    margin-bottom: 20px;
    margin-left: 20px;
    align-self: flex-end;
    div {
      margin-right: 20px;
    }
  }
}

</style>