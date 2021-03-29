<template>
  <div>
    <v-row>
      <v-col sm=6>
        <div>
          <v-row>
            <v-col sm=2>
              <h2>权限码</h2>
            </v-col>
            <v-col >
              <v-btn color="primary" @click="handleCreate">create</v-btn>
            </v-col>
          </v-row>
        </div>
        
        <v-data-table
          :headers="headers"
          :items="list"
          :items-per-page="5"
        >
          <template v-slot:item.type="{ item }">
            <v-chip
              :color="item.type === 'FUNC'? 'primary': 'error'"
              dark
            >
              {{ item.type }}
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
      </v-col>
    </v-row>
    <edit-dialog 
      :visible="visible"
      :formTitle="formTitle"
      :form="form"
      @close="handleClose"
      @save="handleSave"
    />
    <delete-dialog 
      :visible="deleteVisible"
      @close="deleteFormClose"
      @delete="deleteFormItem"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import EditDialog from './components/edit_dialog'
import DeleteDialog from './components/delete_dialog'
export default {
  name: 'baisc',
  components: {
    EditDialog,
    DeleteDialog
  },
  data: () => ({
    visible: false,
    deleteVisible: false,
    formTitle: "",
    form: {},
    id: '',
    deleteId: '',
    headers: [
      {
        text: 'code',
        align: 'start',
        sortable: false,
        value: 'code',
      },
      { text: 'type', value: 'type' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]
  }),
  mounted () {
    this.init()
  },
  computed: {
    ...mapState({
      list: state => state.basic.authcode
    })
  },
  methods: {
    ...mapActions([
      'getAuthCodeAction',
      'createAuthCodeAction',
      'updateAuthCodeAction',
      'deleteAuthCodeAction'
    ]),
    init () {
      this.getAuthCodeAction().catch(err => console.log('err',err))
    },

    handleCreate () {
      this.visible = true,
      this.formTitle = 'Create Form'
    },
    handleEdit (item) {
      const { type, code, _id } = item
      this.visible = true
      this.formTitle = 'Edit Form'
      this.id = _id
      this.form = { type, code }
    },

    handleClose () {
      this.visible = false
    },
    handleSave(form){
      const { type, code } = form 
      if(this.id === '') {
        this.createAuthCodeAction({ type, code })
          .then(_ => this.init())
          .catch(err => console.log('err', err))
      }else {
        this.updateAuthCodeAction({ id: this.id,  type, code  })
          .then(_ => this.init())
          .catch(err => console.log('err', err))
      }
      this.id = ''
      this.formTitle = ''
      this.form = {}
      this.handleClose()
    },

    handleDelete (item) {
      const { _id } = item
      this.deleteId = _id
      this.deleteVisible = true
    },
    deleteFormClose () {
      this.deleteVisible = false
    },
    deleteFormItem () {
      this.deleteAuthCodeAction(this.deleteId)
        .then(_ => this.init())
        .catch(err => console.log('err', err))
      this.deleteFormClose()
    }
  }

}

</script>
<style scoped>
</style>
