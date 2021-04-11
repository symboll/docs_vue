<template>
  <div class="edit_wrap">
    <div class="edit_label">{{ label }} <span class="colon">:</span> </div>
    <div class="view_text" v-if="view">
      <template v-if="label === 'role'">
        <template v-if="viewValue && viewValue.length > 0">
          <div v-for="item in viewValue" :key="item" class="role_item" >{{ item }}</div>
        </template>
        <template v-else>
          暂无职位
        </template>
      </template>
      <template v-else>
        {{ viewValue }}
      </template>
    </div>
    <component 
      v-else
      :is="type" 
      v-model="value"
      :items="options"
      item-text="label"
      item-value='value'
      :disabled="disabled || view"
    >
    </component>
    <div class="edit_icon" v-if="!disabled">
      <v-icon 
        v-if="view"
        small @click="edit">
        mdi-pencil
      </v-icon>
      <v-icon 
        v-else
        small @click="finished">
        mdi-check-bold
      </v-icon>
    </div>
  </div>
</template>

<script>
import { mapMutations,mapState,mapGetters } from 'vuex'
import { VSelect,VTextField,VInput } from 'vuetify/lib'
export default {
  props: {
    label: {
      type: String
    },
    type: {
      type: String,
      default: "v-text-field"
    },
    options: {
      type: Array,
      default: ()=> []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VSelect,
    VInput,
    VTextField
  },
  data: () => ({
    view: true
  }),
  computed: {
    ...mapGetters([
      'basicUserinfo'
    ]),
    value: {
      get () {
        const item = this.basicUserinfo.find(item => item.label === this.label)
        return item.value
      },
      set (value) {
        this.SET_BASIC_INFO({ key: this.label, value })
      }
    },
    viewValue () {
      if(this.options.length === 0 ) { return this.value }
      else {
        const item = this.options.find(item => item.value === this.value)
        return item ? item.label: ''
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_BASIC_INFO'
    ]),
    edit () {
      this.view = false
    },
    finished () {
      this.view = true
    },
  }

}

</script>
<style lang="scss" scoped>
.edit_wrap {
  height: 60px;
  display: flex;
  align-items: center;
  .edit_label {
    width: 80px;
    .colon {
      font-weight: bold;
    }
  }
  .view_text {
    flex: 1;
  }
  .edit_icon {
    width: 40px;
    text-align: right;
  }
}

::v-deep .v-input--is-disabled input,
::v-deep .v-input--is-disabled .v-select__selections,
::v-deep .v-select .v-select__selection--disabled {
  color: rgba(0,0,0, 0.87) !important;
}

::v-deep .v-input__slot::before {
  border-image: none !important;
}
</style>