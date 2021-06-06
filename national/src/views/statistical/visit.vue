<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>走访消息评价统计</span> 
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
        height="710"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" wdith="100"></el-table-column>
        <template v-for="item in tableHeader">
          <el-table-column
            :key="item.property"
            :label="item.label"
            :width="item.width"  
          >
            <template slot-scope="scope" >
              <span>{{ scope.row[item.property] }}</span>
            </template>
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
        { label: '人员姓名', key: 'name', value: '', type: 'el-input', clearable: true },
        // { label: '统计时间', key: 'year', value: '', type: 'el-date-picker', 
        //     datePickerType: 'year', format: "yyyy 年", valueFormat: "yyyy",  clearable: true},
      ],
      tableHeader: [
        { property: 'deptName', label: '所属派出所', width: ''},
        { property: 'good', label: '优秀', width: ''},
        { property: 'general', label: '一般', width: ''},
        { property: 'insufficient', label: '不足', width: ''},
      ]
    }
  },
  computed : {
    ...mapState({
      list: state => state.statistical. visitList,
      total: state => state.statistical. visitTotal,
      psList: state => state.policeStationList,
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    ...mapActions([
      'getVisitAction',
      'getPoliceStationListAction'
    ]),
    searchFn () {
      const params = {
        ...this.pagination,
        ...this.searchObj
      }
      console.log('params==>',params)
      this.getVisitAction(params)
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
      if(this.currentUser.userType === 1) {
        // 保国大队
        this.getPoliceStationListAction()
          .catch(err => console.log(err))
        this.searchList.splice(1,1)
      }else {
        this.searchList.splice(0,1)
        this.tableHeader.splice(0,1, { property: 'deptName', label: '人员姓名', width: ''})
      }
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
