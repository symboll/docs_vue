<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      :items-per-page="5"
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

export default {
  components: {
    DialogWrap,
    DeleteDialog,
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
  }),

  computed: {
    ...mapState({
      users: state => state.user.userList,
      roles: state => state.role.roleList
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
    init (){
      this.getUserListAction().catch(err => console.log('err',err))
    },
    computedRole(item) {
      return item.role.map(i =>  this.roleMap.get(i) )
    },

    handleEdit(item){

    }
  }
}

</script>
<style lang="scss" scoped>
</style>