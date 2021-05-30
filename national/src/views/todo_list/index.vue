<template>
  <div class="c_wrap">
    <!-- buttonList('TodoList') -->
    <header class="c_header"><span>待办事项列表</span></header>
    <section class="c_body">
      <el-table
        class="c_table"
        :data="list"
        highlight-current-row
        height="610"
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
              <template v-if="item.property === 'type'" >
                <span>{{ computedType(scope.row[item.property])}}</span>
              </template>
              <template v-else-if="item.property === 'status'" >
                <span :class="{
                  'c_red': scope.row[item.property] === 'edit' || scope.row[item.property] === 'init',
                  'c_green': scope.row[item.property] === 'finish',
                  'c_grey': scope.row[item.property] === 'fail',
                }">
                {{ computedStatus(scope.row[item.property])}}
                </span>
              </template>
              <template v-else >
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
            <el-button
              @click.native.prevent="handleView(scope.row)"
              type="text"
              size="small">
              查看
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

    <el-card v-if="show" class="el_todoList">
      <div slot="header" class="clearfix">
        <span>待办事项提醒</span>
        <i class="el-icon-close" style="float: right; padding: 3px 0" @click="handleClose" ></i>
      </div>
      <div class="body">
        <!-- {{ todoListCard }} -->
        <div v-for="item in todoListCard" :key="item.id" class="list_item">
           <div>{{ item.title }}</div>
           <div>{{ item.created }}</div>
           <el-button type="text" @click="handleView(item)">查看</el-button>
        </div>
      </div>
      <div class="foot">
        <el-button type="primary" @click="handleClose">确定</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { setInterval, clearInterval } from 'timers';
export default {
  data (){
    return {
      intervalId: null,
      show: true,
      tableHeader: [
        { property: 'title', label: '事项标题', width: ''},
        { property: 'type', label: '事项类型', width: ''},
        { property: 'digest', label: '事项摘要', width: ''},
        { property: 'status', label: '信息状态', width: ''},
      ],
      pagination: {
        pageNo: 1,
        pageSize: 10
      },
    }
  },
  computed: {
    ...mapState({
      list: state => state.todoList.todoList,
      total: state => state.todoList.todoListTotal,
      todoListCard: state => state.todoList.todoListCard
    }),
    ...mapGetters([
      'buttonList'
    ])
  },
  methods: {
    ...mapActions([
      'getTodoListAction',
      'getTodoListCardAction'
    ]),
    computedStatus (status) {
      switch (status) {
        case 'edit': return '待上报';
        case 'init': return '待审核';
        case 'finish': return '已完成';
        case 'fail': return '已退回';
        default: return ''
      }
    },
    computedType (type) {
      switch (type) {
        case 'position': return '阵地走访';
        case 'position_add': return '重点阵地新增';
        case 'person': return '人员走访';
        case 'person_add': return '重点人员新增';
        case 'info_person': return '信息员新增';
        case 'info_person_cancel': return '信息员上报撤销';
        case 'info_submit': return '信息上报';
        default: return ''
      }
    },
    search () {
      this.getTodoListAction(this.pagination)
        .catch(err => console.log(err))
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.search()   
    },

    handleView (row) {
      if(row.route) {
        this.$router.push({ name: row.route})
      }
    },
    handleClose () {
      this.show = false
    },
    initTodoListCard () {
      this.getTodoListCardAction({
        pageIndex: null,
        pageSize: 10
      })
      this.intervalId = setInterval(() => {
        this.getTodoListCardAction({
          pageIndex: null,
          pageSize: 10
        })
      }, 5000)
    }
    
  },
  beforeDestroy() {
    this.intervalId && clearInterval(this.intervalId)
  },
  mounted() {
    this.search()
    this.initTodoListCard()
  },
}

</script>
<style lang="scss" scoped>
  @import '@/assets/style/custom.scss';

  .c_body {
    height: calc(100vh - 112px);
  }
  .c_wrap {
    position: relative;
    .el_todoList {
      position: absolute;
      right:0;
      bottom: 0;
      width: 480px;
      height: 400px;
      z-index: 100;
      .el-card__body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .body {
          height: 290px;
          overflow: scroll;
          .list_item {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            > div:nth-child(1) {
              font-weight: 500;
            }
            > div:nth-child(2) {
              color: #909399;
            }
          }
        }
        .foot {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .el-button {
            width: 120px;
            margin-right: 20px;
          }
        }
      }
    }
  }

</style>