<template>
  <div>{{ count }}</div>
  <div>{{ double }}</div>
  <button @click="increase">add-btn-1</button>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'demo1',
  setup() {
    const count = ref(0)
    const double = computed(()=> {
      return count.value * 2
    })
    const increase = ()=> {
      count.value++
    }
    return {
      count,
      double,
      increase
    }
  }

})
</script>
