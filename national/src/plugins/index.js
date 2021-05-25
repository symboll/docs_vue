import Vue from 'vue'
import CButton from '@/components/c-button.vue'
import CSearch from '@/components/c-search.vue'
import CCDialog from '@/components/c-c-dialog.vue'
import CTDialog from '@/components/c-t-dialog.vue'
import CTablePagin from '@/components/c-table-pagination.vue'

Vue.component('c-button', CButton)
Vue.component('c-search', CSearch)
Vue.component('c-c-dialog', CCDialog)   //  c=> confirm
Vue.component('c-t-dialog', CTDialog)    // c=> custom t=> template
Vue.component('c-table-pagin',CTablePagin)