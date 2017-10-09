<template>
  <div>
    <h3>Сравнение навигаций</h3>
    <h6>Единовременно сравниваются два источника</h6>
    <div class="row sm-gutter" >
    <q-select
      v-model="srvSelected"
      float-label="Сервер для поиска"
      multiple
      chips
     :options="srvOptions" class="col-xs-3"
    />

    <q-input v-model="navTable" float-label="Справочник (SYS, USR etc.)" placeholder="" class="col-xs-3"/>
    <q-input v-model="navName" float-label="Номер навигации" placeholder="" class="col-xs-3"/>
    </div>
    <br>
    <q-btn color="primary" @click="doDiff" icon="fa-eye">
      Сравнить
    </q-btn>

    <br>
    <br>
    <q-data-table
        :data="t1"
        :config="config"
        :columns="columns1"  
      >
      
      </q-data-table>
      <br>
          <q-data-table
        :data="t2"
        :config="config"
        :columns="columns1"  
      >
      
      </q-data-table>

    
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QBtn,
  QInput,
  QCheckbox,
  QSelect,
  QDataTable
} from 'quasar'

export default {
  name: 'Hello',
  components: {
    QList,
    QItem,
    QBtn,
    QInput,
    QCheckbox,
    QSelect,
    QDataTable
  },
  data () {
    return {
      selection: [],
      navTable: '',
      navName: '',
      srvSelected: [],
      config: {
        rowHeight: '30px',
        pagination: {
          rowsPerPage: 5,
          options: [1, 3, 5, 10, 15, 30, 50, 500]
        },
        columnPicker: true,
        leftStickyColumns: 2,
        responsive: true
      },
      columns1: [
        { label: '.',
          field: 'match',
          width: '10px',
          style (val) {
            return val === 'false' ? {background: 'red'} : {}
          }
        },
        { label: '#NAV', field: 'NAVNOM', width: '20px', sort: true },
        { label: '№',
          field: 'NAVN',
          width: '50px',
          sort: true
        },
        { label: 'EVENT', field: 'EVENT', width: '100px', sort: true },
        { label: 'COND', field: 'COND', width: '100px', sort: true },
        { label: 'ACTION', field: 'ACTION', width: '300px', sort: true },
        { label: 'OP', field: 'OP', width: '400px', sort: true },
        { label: 'COMM', field: 'COMM', width: '100px', sort: true }
      ]

    }
  },
  watch: {
    srvSelected: function (n) {
      if (this.srvSelected.length > 2) {
        this.srvSelected.splice(0, 1)
      }
    }
  },
  computed: {
    match (e) {
      // console.log('eeeeeeee', e)
      return true
    },
    columns () {
      return Object.keys(this.$store.state.diffResult[0])
    },
    t1 () {
      return Object.values(this.$store.state.diffResult[0])
    },
    t2 () {
      return Object.values(this.$store.state.diffResult[1])
    },
    tdata () {
      return this.$store.state.diffResult
    },
    servers () {
      return this.$store.state.serversList
    },
    srvOptions () {
      let arr = [].concat.apply([], this.$store.state.serversList.map(server => {
        return [{label: server.name, value: server.id}, {label: `local ${server.name}`, value: `local@${server.name}`}]
      }))
      console.log(arr)
      return arr
    }
  },
  methods: {
    doDiff: function (e) {
      let infoQuery = `select t1.mdate "lastmod", (select max(rownum) from f_nav${this.navTable} t2 where t2.NAVNOM=t1.NAVNOM) "rowsumm" from f_nav${this.navTable} t1 where t1.navnom='${this.navName}' and t1.mdate=(select max(t3.mdate) from f_nav${this.navTable} t3 where t3.NAVNOM=t1.NAVNOM)`
      let strSQL = `select * from f_NAV${this.navTable} where NAVNOM=${this.navName}`
      this.$store.dispatch('diffNav', {navName: `${this.navTable}_${this.navName}`, query: strSQL, infoquery: infoQuery, servers: this.srvSelected})
    }
  },
  mounted () {

  },
  beforeDestroy () {

  }
}
</script>

<style lang="stylus">
.p10
  margin-left: 10px
.notmatch
  background: bisque  
  </style>