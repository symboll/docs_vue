<template>
  <div>
    <div>
      <v-row>
        <v-col >
          <v-btn color="primary" @click="handleCreate">create</v-btn>
        </v-col>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="roles"
      :items-per-page="5"
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DeleteDialog from '@/components/delete_dialog'
import DialogWrap from '@/components/dialog_wrap';
export default {
  components: {
    DialogWrap,
    DeleteDialog,
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
      { text: 'role', value: 'name',sortable: false, align: 'start' },
      { text: 'level', value: 'level' },
      { text: 'auth', value: 'auth' ,sortable: false, width: '70%'},
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),

  computed: {
    ...mapState({
      roles:  state => state.role.roleList,
      authCodes: state => state.authCode.authcodeList
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
    init (){
      this.getRoleAction().catch(err => console.log('err',err))
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
          .then(_ => this.init())
          .catch(err => console.log("err", err));
      } else {
        this.updateRoleAction({ id: this.id, name, level, auth })
          .then(_ => this.init())
          .catch(err => console.log("err", err));
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
        .then(_ => this.init())
        .catch(err => console.log('err',err))
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