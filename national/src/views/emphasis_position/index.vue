<template>
  <div class="c_wrap">
    <header class="c_header">
      <span>阵地列表</span>
      <c-button 
        v-if="buttonList('EmphasisPosition').includes('add')"
        flat iconType="ic_xinzeng" @click="handleCreate"> 
        <span>新增</span>
      </c-button>
      <c-button 
        v-if="buttonList('EmphasisPosition').includes('toExcel')"
        flat iconType="daochu" @click="handleExport">
        <span>导出</span>
      </c-button>      
    </header>
    

    <section class="c_body">
      <c-search 
        :searchList.sync="searchList"
        @search="handleSearch"
        :psList="psList"
        :policeList="policeList"
        :statusList="statusList"
        @policeStationChange="handleChangepoliceStation"
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
            :key="item.property"
            :label="item.label"
            :width="item.width"  
          >
            <template slot-scope="scope">
              <template >
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
            <template v-if="buttonList('EmphasisPosition').includes('info')">
              <el-button
                @click.native.prevent="handleDetail(scope.row)"
                type="text"
                size="small">
                详情
              </el-button>
              <span> | </span>
            </template>
            <template v-if="buttonList('EmphasisPosition').includes('edit')">
              <el-button 
                @click.native.prevent="handleEdit(scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <span> | </span>
            </template>
            <el-button
              v-if="buttonList('EmphasisPosition').includes('del')"
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

    <c-c-dialog
      :visible="visible"
      @confirm="handleConfirm"
      @close="handleClose"
    ></c-c-dialog> 
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

import { baseURL } from '../../config/index.js'
import { getToken } from '../../lib/util.js'
export default {
  data () {
    return {
      searchList: [
        { label: '阵地名称', key: 'name', value: '', type: 'el-input', clearable: true },
        { label: '所属组织', key: 'orgId', value: '', type: 'el-select', option: "psList", clearable: true},
        { label: '关系民警', key: 'sysUserId', value: '', type: 'el-select' , option: "policeList", clearable: true},
        { label: '审核状态', key: 'status', value: '', type: 'el-select', option: "statusList", clearable: true },
      ],
      searchObj: {},
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      tableHeader: [
        { property: 'name', label: '阵地名称', width: ''},
        { property: 'type', label: '种类', width: ''},
        { property: 'cardNo', label: '登记证号', width: ''},
        { property: 'deptName', label: '管辖单位', width: ''},
        { property: 'sysUserName', label: '责任民警', width: ''},
      ],
      removeId: 0,

      visible: false,
    }
  },
  computed: {
    ...mapState({
      list: state => state.position.positionList,
      total: state => state.position.positionListTotal,
      itemInfo: state => state.position.positionItem,

      psList: state => state.policeStationList,
      policeList: state => state.policeList,
      statusList: state => state.positionStatusList
    }),
    ...mapGetters([
      'buttonList'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions([
      'getPositionListAction',
      'getPositionDetailAction',
      'createOrUpdatePositionAction',
      'removePositionAction',
      'auditPositionAction',

      "getPoliceStationListAction",
      "getPoliceListAction",
      'exportAction'
    ]),
    ...mapMutations([
      'SET'
    ]),

    init () {
      this.getPositionListAction()
        .catch(err => console.log(err))
      this.getPoliceStationListAction()
        .catch(err => console.log(err))
    },
    handleChangepoliceStation (orgId) {
      this.getPoliceListAction(orgId).catch(err => console.log(err))
    },

    handleCreate () {
      this.SET({ module: "position", key: "positionItem", value: {} })
      this.$router.push({ name: "EmphasisPositionEdit" })
    },

    handleExport() {
      window.location.href = `${baseURL}/api/position/v1/toExcel?Authorization=${getToken()}`
    },
    handleDetail(row) {
      this.$router.push({ 
        name: "EmphasisPositionInfo" , 
        query: { id: row.id }
      })
    },
    handleEdit (row) {
      this.getPoliceListAction(row.orgId)
      this.$router.push({ 
        name: "EmphasisPositionEdit",
        query: { id: row.id }
      })
    },

    handleRemove (row) {
      this.removeId =  row.id
      this.visible = true
    },
    handleClose () {
      this.visible = false
    },
    handleConfirm () {
      if(this.removeId !== 0) {
        this.removePositionAction(this.removeId)
          .then(_ => {
            this.visible = false
            this.getPositionListAction()
          })
      }
    },
 
    handleSearch (searchObj) {
      let { time, status, ...otherOptions } = searchObj
      if(time) {
        const beginTime = time[0]
        const endTime = time[1]
        otherOptions.beginTime = beginTime
        otherOptions.endTime = endTime
      }
      if(status) {
        const res = this.statusList.find(item => item.id === status) || {}
        otherOptions.status = res.status
      }

      this.searchObj = otherOptions
      this.pagination = { pageNo: 1, pageSize: 10 }
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
    searchFn () {
      this.getPositionListAction({
        ...this.searchObj,
        ...this.pagination
      });
    }
  },
};
</script>
<style lang='scss' scoped>
  @import '@/assets/style/custom.scss';

</style>
