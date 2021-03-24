<template>
  <div>{{ count }}</div>
  <div>{{ double }}</div>
  <button @click="increase">add-btn-3</button>
</template>

<script lang="ts">
interface DataInterface {
  count: number,
  double: number,
  increase: ()=> void
}
import { defineComponent, reactive, computed, toRefs } from 'vue'
export default defineComponent({
  name: 'deme3',
  setup () {
    const data: DataInterface = reactive({
      count: 0,
      increase: ()=> { data.count ++ },
      double: computed(()=> data.count * 2 )
    })
    const dataRef = toRefs(data)
    return {
      ...dataRef
    }
  }
})
</script>