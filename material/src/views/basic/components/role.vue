<template>
  <div>
    <table-header 
      :options="searchOptions"
      @search="search"
      @create="handleCreate"
      :outerItems="authCodes"
    />
    <v-data-table
      :headers="headers"
      :items="roles"
      :loading="loading"
      :options.sync="options"
      :server-items-length="total"
    >
      <template v-slot:item.auth="{ item }">
        <v-chip
          v-for="i in computedCode(item)"
          :key="i.code"
          :color="i.type === 'FUNC'? 'primary': 'error'"
          dark
          class="mr-2 mb-2 mt-2"
        >
          {{ i.code }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="handleEdit(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="handleDelete(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <dialog-wrap
      :visible="visible"
      :formTitle="formTitle"
      :form="form"
      :authCodes="authCodes"
      :items="items"
      @close="handleClose"
      @save="handleSave"
    >
      <v-col class="d-flex" cols="12">
        <v-text-field v-model="form.name" label="name"></v-text-field>
      </v-col>

      <v-col class="d-flex" cols="12">
        <v-select
          v-model="form.level"
          :items="items"
          label="level"
        ></v-select>
      </v-col>


      <v-col sm="12" class="checkbox_wrap">
        <v-checkbox
          v-model="form.auth"
          v-for="item in authCodes"
          :key="item._id"
          :label="item.code"
          :value="item._id"
        ></v-checkbox>
      </v-col>
    </dialog-wrap>

    <delete-dialog 
      :visible="deleteVisible"
      @close="deleteFormClose"
      @delete="deleteFormItem"
    />
    <alert 
      :type="alertType"
      :visible.sync="alertVisible"
      :alertText="alertText"
      :delay="delayTime"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DeleteDialog from '@/components/delete_dialog'
import DialogWrap from '@/components/dialog_wrap'
import TableHeader from '@/components/table_header'
export default {
  components: {
    DialogWrap,
    DeleteDialog,
    TableHeader
  },
  data: ()=> ({
    visible: false,
    formTitle: '',
    id: '',
    form: {},
    deleteVisible: false,
    deleteId: '',
    items: [1,2,3,4,5,6,7,8,9,10],
    headers: [
      { text: 'name', value: 'name',sortable: false, align: 'start' },
      { text: 'level', value: 'level' },
      { text: 'auth', value: 'auth' ,sortable: false, width: '70%'},
      { text: 'Actions', value: 'actions', align: 'end', sortable: false },
    ],
    options: {
      page: 1,
      itemsPerPage: 10
    },
    searchOptions: [
      { 
        value: '',
        label: 'name',
        type: 'input'
      },
      { 
        value: '',
        label: 'level',
        type: 'input'
      },
      { 
        value: '',
        label: 'auth',
        type: 'select',
        multiple: true,
        outerItems: true,
        itemText: 'code',
        itemValue: '_id'
      }
    ],
    alertVisible: false,
    alertType: '',
    alertText: '',
    delayTime: 2000
  }),
  watch: {
    'options.page' (page) {
      this.query()
    },
    'options.itemsPerPage' (itemsPerPage) {
      this.query()
    }
  },
  computed: {
    ...mapState({
      roles:  state => state.role.roleList,
      authCodes: state => state.authCode.authcodeAllList,
      total: state => state.role.total,
      loading: state => state.role.loading,
    }),
    codeMap () {
      const map = new Map()
      this.authCodes.map(item => {
        map.set(item._id, {
          code: item.code,
          type: item.type
        })
      })
      return map
    }
  },
  methods: {
    ...mapActions([
      'getRoleAction',
      'createRoleAction',
      'updateRoleAction',
      'deleteRoleAction'
    ]),
    message (alertType, alertText) {
      this.alertVisible = true
      this.alertType = alertType
      this.alertText = alertText
    },
    search (options) {
      const query = {}
      options.forEach(item => {
        if(item.value) query[item.label] = item.value  
      })
      this.getRoleAction(query)
        .catch(err => this.message('error', `Error: ${err.message}`))
    },
    query (isCreateOrDelete = false) {
      const { page=1, itemsPerPage=10 } = this.options
      this.getRoleAction({
        pageSize: isCreateOrDelete ? 10: itemsPerPage,
        pageNo: isCreateOrDelete? 1:  page
      })
        .catch(err => this.message('error', `Error: ${err.message}`))
    },
    computedCode (item) {
      return item.auth.map(i => this.codeMap.get(i))
    },
    handleCreate() {
      this.visible = true
      this.form = { auth: [] };
      this.formTitle = "Create Form"
    },
    handleEdit(item){
      const { name, level, auth, _id } = item;
      this.visible = true;
      this.formTitle = "Edit Form";
      this.id = _id;
      this.form = { name, level, auth };
    },
    handleClose () {
      this.visible = false;
    },
    handleSave (form) {
      const { name, level, auth } = form;
      if (this.id === "") {
        this.createRoleAction({ name, level, auth })
          .then(_ => this.query(true))
          .catch(err => this.message('error', `Error: ${err.message}`))
      } else {
        this.updateRoleAction({ id: this.id, name, level, auth })
          .then(_ => this.query())
          .catch(err => this.message('error', `Error: ${err.message}`))
      }
      this.id = "";
      this.formTitle = "";
      this.form = {};
      this.handleClose();
    },
    handleDelete (item) {
      const { _id } = item
      this.deleteId = _id;
      this.deleteVisible = true
    },
    deleteFormClose() {
      this.deleteVisible = false
    },
    deleteFormItem(){
      this.deleteRoleAction(this.deleteId)
        .then(_ => this.query(true))
        .catch(err => this.message('error', `Error: ${err.message}`))
      this.deleteFormClose()
    }
  }
}

</script>
<style lang="scss" scoped>
.checkbox_wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  > .v-input {
    margin-right: 6px;
  }
}
</style>