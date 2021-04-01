<template>
  <div>
    <table-header 
      :options="searchOptions"
      @search="search"
      :createBtn="false"
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
          @click="handleEdit(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
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
      { text: 'Actions', value: 'actions' , sortable: false},
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
      }
    ]
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
    query (isCreateOrDelete = false) {
      const { page=1, itemsPerPage=10 } = this.options
      console.log('page',page, 'itemsPerPage', itemsPerPage)
      this.getUserListAction({
        pageSize: isCreateOrDelete ? 10: itemsPerPage,
        pageNo: isCreateOrDelete? 1:  page
      }).catch(err => console.log('err',err))
    },
    search (options) {
      const query = {}
      options.forEach(item => {
        if(item.value) query[item.label] = item.value  
      })
      this.getUserListAction(query).catch(err => console.log('err', err))
    },
    computedRole(item) {
      return item.role.map(i =>  this.roleMap.get(i) )
    },

    handleEdit(item){
      console.log('--->',item)
    }
  }
}

</script>
<style lang="scss" scoped>
</style>