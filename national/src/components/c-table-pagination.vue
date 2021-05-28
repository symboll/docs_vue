<template>
  <div>
    <section class="c_middle">
      <div class="c_middle_title">
        <div class="title">{{ tableTitle }}</div>
        <!-- v-if="itemInfo.status !== 'init'" -->
        <c-button
          flat iconType="ic_xinzeng" @click="handleCreate">
          <span >新增</span>
        </c-button>
      </div>
    </section>
    <section class="c_table_body">
      <el-table
        class="c_table"
        :data="list"
        highlight-current-row
        height="200"
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
              <!-- <template v-if="item.property ==='status'">
                <span> {{ statusMap[scope.row['status']] }}</span>
              </template>
              <template v-else> -->
                <span>{{ scope.row[item.property] }}</span>
              <!-- </template> -->
            </template>
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      pagination: {
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  props: {
    tableTitle: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: ()=> []
    },
    total: {
      type: Number,
      default: 0
    },
    tableHeader: {
      type: Array,
      default: ()=> []
    }
  },
  methods: {
    handleCreate() {
      this.$emit('create')
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.$emit('search', this.pagination)
    },
    handleCurrentChange (val) {
      this.pagination.pageNo = val
      this.$emit('search', this.pagination)
    },
    handleDetail (row) {
      this.$emit('detail', row.id)
    },
    handleEdit (row) {
      this.$emit('edit', row.id)
    },
    handleRemove (row) {
      this.$emit('remove', row.id)
    }
  },
}

</script>
<style lang="scss" scoped>
.c_middle { 
  margin-bottom: 10px;
  margin-top: 20px;
  &_title {
    display: flex;
    .title {
      font: {
        size: 16px;
        weight: bold;
        family: 'MicrosoftYaHei-Bold';
      }
      color: #333333;
      margin-right: 20px;
    }
  }
}

.c_table_body {
  margin-left: -20px;
  margin-right: -20px;
  display: flex;
  flex-direction: column;
  height: calc(50vh - 140px);
  justify-content: space-between;
}
</style>