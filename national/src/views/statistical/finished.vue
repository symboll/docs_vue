<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>任务下派完成情况统计</span> 
    </header>
    <section class="c_body">
      <c-search 
        :searchList.sync="searchList"
        @search="handleSearch"
        :psList="psList"
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
            v-if="item.property === 'deptName' || item.property === 'personCount'"
            :key="item.property"
            :label="item.label"
            :width="item.width"  
          >
            <template slot-scope="scope" >
              <span>{{ scope.row[item.property] }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            v-else
            :key="item.property"
            :label="item.label"
            :width="item.width"
          >
            <el-table-column 
              v-for="i in item.children" 
              :label="i.label"
              :key="i.property"
            >
              <template slot-scope="scope" >
                <span>{{ scope.row[item.property][i.property] }}</span>
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
      searchObj: {},
      searchList: [
        { label: '所属派出所', key: 'orgId', value: '', type: 'el-select',option: "psList", clearable: true },
        { label: '统计时间', key: 'year', value: '', type: 'el-date-picker', 
            datePickerType: 'year', format: "yyyy 年", valueFormat: "yyyy",  clearable: true},
      ],
      tableHeader: [
        { property: 'deptName', label: '所属派出所', width: ''},
        { property: 'personCount', label: '重点人员数量', width: ''},
        { label: "第一季度", property: 'one', children: [
            { property: 'finishCount', label: '总数', width: ''},
            { property: 'unfinishedCount', label: '未完成', width: ''},
          ] 
        },
        { label: "第二季度", property: 'two', children: [
            { property: 'finishCount', label: '总数', width: ''},
            { property: 'unfinishedCount', label: '未完成', width: ''},
          ] 
        },
        { label: "第三季度", property: 'three', children: [
            { property: 'finishCount', label: '总数', width: ''},
            { property: 'unfinishedCount', label: '未完成', width: ''},
          ] 
        },
        { label: "第四季度", property: 'four', children: [
            { property: 'finishCount', label: '总数', width: ''},
            { property: 'unfinishedCount', label: '未完成', width: ''},
          ] 
        }
      ]
    }
  },
  computed : {
    ...mapState({
      list: state => state.statistical.finishedList,
      total: state => state.statistical.finishedTotal,
      psList: state => state.policeStationList,
    })
  },
  methods: {
    ...mapActions([
      'getFinishedAction',
      'getPoliceStationListAction'
    ]),

    searchFn () {
      const params = {
        ...this.pagination,
        ...this.searchObj
      }
      this.getFinishedAction(params)
    },
    handleSearch (searchObj) {
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
      this.getPoliceStationListAction()
        .catch(err => console.log(err))
    }
  },
  mounted() {
    this.searchFn()
    this.init()
  },
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom.scss';
</style>