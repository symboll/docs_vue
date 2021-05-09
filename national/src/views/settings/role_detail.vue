<template>
  <div class="card_wrap">
    <div v-if="type === 'empty'" class="box_card"></div>

    <el-card v-else class="box_card">
      <div slot="header" class="clearfix">
        <span>{{ item.name }}</span>
      </div>
      <div>
        <el-tree
          @check-change="checkChange"
          default-expand-all
          check-strictly
          :data="[item]"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps">
        </el-tree>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: "role_detail",
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String | Number,
      default: "item"
    },
    defaultCheckedKeys:{
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name',
        disabled: 'id'
      })
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState({
      selectedRole: state => state.role.selectedRole
    })
  },
  methods: {
    checkChange(a,b,c) {
      this.$emit('checkChange', { id: a.id, value: b })
    }
  },
  mounted() {

  },
}

</script>
<style lang='scss' scoped>
.card_wrap {
  width: 30%;
  min-width: 320px;
  margin-bottom: 10px;
  margin-right: 10px;
  .box_card {
    height: 100%;
  }
  ::v-deep .el-card__body {
    padding: 20px !important;
    min-height: 240px;
  }
}
</style>