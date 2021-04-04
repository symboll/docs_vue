<template>
  <div>
    <table-header
      :options="searchOptions"
      @search="search"
      @create="handleCreate"
    />  
    <v-data-table 
      :headers="headers"
      :items="list" 
      :loading="loading"
      :options.sync="options"
      :server-items-length="total"
      >
      <template v-slot:item.type="{ item }">
        <v-chip :color="item.type === 'FUNC' ? 'primary' : 'error'" dark>
          {{ item.type }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="handleEdit(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="handleDelete(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    
    <dialog-wrap
      :visible="visible"
      :formTitle="formTitle"
      :form="form"
      :items="items"
      @close="handleClose"
      @save="handleSave"
    >
        <v-col class="d-flex" cols="12">
          <v-text-field v-model="form.code" label="code"></v-text-field>
        </v-col>

        <v-col class="d-flex" cols="12">
          <v-select
            v-model="form.type"
            :items="items"
            label="type"
          ></v-select>
        </v-col>
    </dialog-wrap>
    <delete-dialog
      :visible="deleteVisible"
      @close="deleteFormClose"
      @delete="deleteFormItem"
    />
    <alert 
      :type="alertType"
      :visible="alertVisible"
      :alertText="alertText"
      :delay="delayTime"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DeleteDialog from "@/components/delete_dialog"
import DialogWrap from '@/components/dialog_wrap'
import TableHeader from '@/components/table_header'

export default {
  name: "authCode",
  components: {
    DialogWrap,
    DeleteDialog,
    TableHeader
  },
  data: () => ({
    visible: false,
    deleteVisible: false,
    formTitle: "",
    form: {},
    id: "",
    deleteId: "",
    items: ["PAGE", "FUNC"],
    headers: [
      { text: "code",  value: "code", align: "start", sortable: false,  width: 200 },
      { text: "type", value: "type", },
      { text: "Actions", value: "actions", align: "end", sortable: false }
    ],
    options: {
      page: 1,
      itemsPerPage: 10
    },
    searchOptions:[
      { 
        value: '',
        label: 'code',
        type: 'input'
      },
      { 
        value: '',
        label: 'type',
        type: 'select',
        items: ['PAGE', 'FUNC']
      }
    ],
    alertVisible: false,
    alertType: '',
    alertText: '',
    delayTime: 2000
  }),

  computed: {
    ...mapState({
      list: state => state.authCode.authcodeList,
      total: state => state.authCode.total,
      loading: state => state.authCode.loading,
    })
  },
  watch: {
    'options.page' (page) {
      this.query()
    },
    'options.itemsPerPage' (itemsPerPage) {
      this.query()
    }
  },
  methods: {
    ...mapActions([
      "getAuthCodeAction",
      "createAuthCodeAction",
      "updateAuthCodeAction",
      "deleteAuthCodeAction"
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
      this.getAuthCodeAction(query)
        .catch(err => this.message('error', `Error: ${err.message}`))
    },
    query (isCreateOrDelete = false) {
      const { page=1, itemsPerPage=10 } = this.options
      this.getAuthCodeAction({
        pageSize: isCreateOrDelete ? 10: itemsPerPage,
        pageNo: isCreateOrDelete? 1:  page
      })
        .catch(err => this.message('error', `Error: ${err.message}`))
    },
    handleCreate() {
      (this.visible = true), (this.formTitle = "Create Form");
    },
    handleEdit(item) {
      const { type, code, _id } = item;
      this.visible = true;
      this.formTitle = "Edit Form";
      this.id = _id;
      this.form = { type, code };
    },

    handleClose() {
      this.visible = false;
    },
    handleSave(form) {
      const { type, code } = form;
      if (this.id === "") {
        this.createAuthCodeAction({ type, code })
          .then(_ => this.query(true))
          .catch(err => this.message('error', `Error: ${err.message}`))
      } else {
        this.updateAuthCodeAction({ id: this.id, type, code })
          .then(_ => this.query())
          .catch(err => this.message('error', `Error: ${err.message}`))
      }
      this.id = "";
      this.formTitle = "";
      this.form = {};
      this.handleClose();
    },

    handleDelete(item) {
      const { _id } = item;
      this.deleteId = _id;
      this.deleteVisible = true;
    },
    deleteFormClose() {
      this.deleteVisible = false;
    },
    deleteFormItem() {
      this.deleteAuthCodeAction(this.deleteId)
        .then(_ => this.query(true))
        .catch(err => this.message('error', `Error: ${err.message}`))
      this.deleteFormClose();
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
