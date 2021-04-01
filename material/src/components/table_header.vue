<template>
  <div class="header_search">
    <v-row>
      <v-col md=2 v-if="createBtn">
        <v-btn 
          @click="create" 
          color="primary"
        >
          <v-icon>mdi-folder-plus-outline</v-icon>  Create
        </v-btn>
      </v-col>
      <v-col :md="item.multiple ? 3: 2"  v-for="item in options" :key="item.label">
        <v-text-field
          v-if="item.type === 'input'"
          outlined
          clearable
          dense
          v-model="item.value" 
          :label="item.label">
        </v-text-field>
        <v-select
          v-else
          v-model="item.value" 
          :items="item.outerItems ? outerItems :item.items"
          :label="item.label"
          :multiple="item.multiple"
          :item-text="item.itemText ? item.itemText: 'text'"
          :item-value="item.itemValue ? item.itemValue: 'value'"
          dense
          clearable
          outlined
        ></v-select>
      </v-col>
      <v-col md="2">
        <v-btn 
          @click="search" 
          color="primary"
        >
          <v-icon> mdi-magnify</v-icon> Search
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "tableHeader",
  props: {
    options: {
      type: Array,
      default: ()=> []
    },
    outerItems: {
      type: Array,
      default: () => []
    },
    createBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    search () { 
      this.$emit('search', this.options)
    },
    create () {
      this.$emit('create')
    }
  }
}

</script>
<style lang="scss" scoped>
.header_search {
  transform: translateY(13px);
}
</style>