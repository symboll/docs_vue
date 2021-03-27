<template>
  <div>{{ data.count }}</div>
  <div>{{ data.double }}</div>
  <button @click="data.increase">add-btn-2</button>
</template>

<script lang="ts">
interface DataInterface {
  count: number,
  double: number,
  increase: ()=> void
}
import { defineComponent, reactive, computed } from 'vue'
export default defineComponent({
  name: 'demo2',
  setup () {
    const data: DataInterface = reactive({
      count: 0,
      increase: ()=> { data.count ++ },
      double: computed(()=> data.count * 2 )
    })
    return {
      data
    }
  }
})
</script>