<template>
  <div>参数配置


    打印:
    <c-button round iconType="ic_dayin">  
      <span>打印</span>
    </c-button>
    编辑:
    <c-button round iconType="ic_bianji" :loading='loading' @click="loadingClick">
      <span>编辑</span>
    </c-button>


    <c-button iconType="ic_bianji">
      <span>按钮</span>
    </c-button>

    提交:
    <c-button round iconType="ic_tijiao">
      <span >提交</span>
    </c-button>
    任务下放:
    <c-button round iconType='ic_renwuxf'>
      <span>任务下放</span>
    </c-button>

    新增:
    <c-button flat iconType="ic_xinzeng">
      <span >新增</span>
    </c-button>

    导入:
    <c-button flat iconType='ic_daoru'>
      <span>导入</span>
    </c-button>

    导出:
    <c-button flat iconType="daochu">
      <span>导出</span>
    </c-button>

    搜索:
    <c-button icon iconType='ic_Search'>
    </c-button>

    搜索:
    <c-button icon grey :rotate="rotate" iconType="ic_chognzhi" @click="handleClick">
    </c-button>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rotate:false,
      loading: false
    }
  },
    methods: {
    handleClick() {
      this.rotate = true
      setTimeout(()=> { this.rotate = false }, 300)
    },
    loadingClick () {
      this.loading = true
      setTimeout(()=> {this.loading = false}, 3000)
    }
  }
}

</script>
<style scoped>
</style>