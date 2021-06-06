<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>人员思想情况评估统计</span> 
    </header>
    <section class="c_body">
      <c-search 
        :searchList.sync="searchList"
        @search="handleSearch"
        :psList="psList"
        :taskTypeList="taskTypeList"
      />
      <el-table
        class="c_table"
        :data="list"
        highlight-current-row
        height="710"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" wdith="100"></el-table-column>
        <template v-for="item in tableHeader">
          <el-table-column
            v-if="!item.children"
            :key="item.property"
            :label="item.label"
            :width="item.width"  
          >
            <template slot-scope="scope" >
              <template v-if="item.property === 'taskType'">
                <span>{{ taskMap[scope.row[item.property]] }}</span>
              </template>
              <template v-else>
                <span>{{ scope.row[item.property] }}</span>
              </template>
            </template>
          </el-table-column>

          <el-table-column
            v-else
            :key="item.property"
            :label="year"
            :width="item.width"
          >
            <el-table-column 
              v-for="i in item.children" 
              :label="i.label"
              :key="i.property"
            >
              <template slot-scope="scope" >
                <span>{{ scope.row[i.property] }}</span>
              </template>
            </el-table-column>

          </el-table-column>
        </template>
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      year: new Date().getFullYear() + '年',
      searchObj : {},
      searchList: [
        { label: '人员姓名', key: 'name', value: '', type: 'el-input', clearable: true },
        { label: '统计时间', key: 'year', value: '', type: 'el-date-picker', 
            datePickerType: 'year', format: "yyyy 年", valueFormat: "yyyy",  clearable: true},
        { label: '所属派出所', key: 'orgId', value: '', type: 'el-select',option: "psList", clearable: true },
        { label: '任务类型', key: 'taskType', value: '', type: 'el-select',option: "taskTypeList", clearable: true },
      ],
      tableHeader: [
        { property: 'name', label: '姓名', width: ''},
        { property: 'taskType', label: '任务类型', width: ''},
        { property: 'deptName', label: '所属派出所', width: ''},
        { property: 'year', label: `2021年`, children: [
            { property: 'one', label: '一季度', width: ''},
            { property: 'two', label: '二季度', width: ''},
            { property: 'three', label: '三季度', width: ''},
            { property: 'four', label: '四季度', width: ''},
          ] 
        },

      ],
      taskTypeList: [{
         id: "auto", label: "自动"
      }, {
        id: "taskDown", label: "任务下派"
      }],
      taskMap: {
        auto: "自动",
        taskDown: "任务下派"
      }
    }
  },
  computed : {
    ...mapState({
      list: state => state.statistical.ideologicalList,
      total: state => state.statistical.ideologicalTotal,
      psList: state => state.policeStationList,
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    ...mapActions([
      'getIdeologicalAction',
      'getPoliceStationListAction'
    ]),
    searchFn () {
      const params = {
        ...this.pagination,
        ...this.searchObj,
        type: 'person'
      }
      this.getIdeologicalAction(params)
    },
    handleSearch (searchObj) {
      const {year} = searchObj
      if (year) this.year = year + '年'
      this.searchObj = searchObj
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
    init () {
      if(this.currentUser.userType === 1) {
        // 保国大队
        this.getPoliceStationListAction()
          .catch(err => console.log(err))
      }else {
        this.searchList.splice(2,2)
        this.tableHeader.splice(1,2)
      }
    }
  },
  mounted() {
    this.searchFn(),
    this.init()
  },
}

</script>
<style lang="scss" scoped>
@import '@/assets/style/custom.scss';
</style>

