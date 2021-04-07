<template>
  <div>
    <table-header 
      :options="searchOptions"
      @search="search"
      :createBtn="false"
      :outerItems="roles"
    />
    <v-data-table
      :headers="headers"
      :items="users"
      :loading="loading"
      :options.sync="options"
      :server-items-length="total"
    >
      <template v-slot:item.role="{ item }">
        <v-chip
          v-for="i in computedRole(item)"
          :key="i.name"
          color="black32"
          dark
          class="mr-2 mb-2 mt-2"
        >
          {{ i.name }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="assignment(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
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
import DialogWrap from '@/components/dialog_wrap';
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
    headers: [
      { text: 'username', value: 'username' ,sortable: false ,align: 'start' },
      { text: 'E-mail', value: 'email', sortable: false  },
      { text: 'role', value: 'role' ,sortable: false},
      { text: 'Actions', value: 'actions', align: 'end', sortable: false},
    ],
    options: {
      page: 1,
      itemsPerPage: 10
    },
    searchOptions: [
      { 
        value: '',
        label: 'username',
        type: 'input'
      },
      { 
        value: '',
        label: 'email',
        type: 'input'
      },
      {
        value: '',
        label: 'role',
        type: 'select',
        multiple: true,
        outerItems: true,
        itemText: 'name',
        itemValue: '_id'
      }
    ],
    alertVisible: false,
    alertType: '',
    alertText: '',
    delayTime: 2000
  }),
  watch: {
    'options.page' () {
      this.query()
    },
    'options.itemsPerPage' () {
      this.query()
    }
  },
  computed: {
    ...mapState({
      users: state => state.user.userList,
      roles: state => state.role.roleAllList,
      total: state => state.user.total,
      loading: state => state.user.loading
    }),
    roleMap () {
      const map = new Map()
      this.roles.map(item => {
        map.set(item._id, { name: item.name })
      })
      return map
    }
  },
  methods: {
    ...mapActions([
      'getUserListAction',
    ]),
    message (alertType, alertText) {
      this.alertVisible = true
      this.alertType = alertType
      this.alertText = alertText
    },
    query (isCreateOrDelete = false) {
      const { page=1, itemsPerPage=10 } = this.options
      this.getUserListAction({
        pageSize: isCreateOrDelete ? 10: itemsPerPage,
        pageNo: isCreateOrDelete? 1:  page
      })
        .catch(err => this.message('error', `Error: ${err.message}`))
    },
    search (options) {
      const query = {}
      options.forEach(item => {
        if(item.value) query[item.label] = item.value  
      })
      this.getUserListAction(query)
        .catch(err => this.message('error', `Error: ${err.message}`))
    },
    computedRole(item) {
      return item.role.map(i =>  this.roleMap.get(i) )
    },

    assignment(item){
      console.log('--->',item)
    }
  }
}

</script>
<style lang="scss" scoped>
</style>