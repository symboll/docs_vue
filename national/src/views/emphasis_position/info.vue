<template>
  <div class="c_wrap">
    <section class="c_header">
      <div class="title">阵地信息</div>
      <div class="position_info">
        <div v-for="item in showInfoList" :key="item.key">
          <div>{{ item.label }}</div>
          <div>{{ itemInfo[item.key] }}</div>
        </div>
      </div>
    </section>
    <section class="c_middle">
      <div class="c_middle_title">
        <div class="title">走访记录</div>
        <c-button flat iconType="ic_xinzeng" @click="handleCreate">
          <span >新增</span>
        </c-button>
      </div>
    </section>
    <section class="c_body">
      <el-table
        class="c_table"
        :data="list"
        highlight-current-row
        max-height="610"
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
            <!-- <el-button
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
            </el-button> -->
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      list: [],
      total: 0,
      tableHeader: [
        { property: 'time', label: '走访时间', width: ''},
        { property: 'sysUserName', label: '走访民警', width: ''},
        { property: 'address', label: '走访地点', width: ''},
        { property: 'owner', label: '被走访人', width: ''},
        { property: 'name', label: '场所情况评估', width: ''},
        { property: 'status', label: '状态', width: ''},
      ],
      pagination: {
        pageNo:1,
        pageSize: 10
      },
      showInfoList: [
        { key: "name", label: "阵地名称" },
        { key: "type", label: "种类" },
        { key: "cardNo", label: "登记证号" },
        { key: "owner", label: "管理负责人" },
        { key: "address", label: "地址" },
        { key: "orgId", label: "管辖单位" },
        { key: "sysUserId", label: "责任民警" },
        { key: "visitFrequency", label: "走访频率" },
      ]
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState({
      itemInfo: state => state.position.positionItem,
    })
  },
  methods: {
    ...mapActions([
      'getPositionDetailAction'
    ]),
    init () {
      const { id } = this.$route.query
      this.getPositionDetailAction(id)
        .catch(err => console.log(err))
    },
    handleCreate () {

    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    }
  }
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom_info.scss';
</style>