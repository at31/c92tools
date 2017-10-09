<template>
  <div>
    <h3>Поиск по навигациям</h3>
    <div class="row sm-gutter" >
    <q-select
      v-model="srvSelected"
      float-label="Сервер для поиска"
      multiple
      chips
     :options="srvOptions" class="col-xs-3"
    />
    <q-select
      v-model="fnSelect"
      float-label="Поле для поиска"
      radio
     :options="fieldName" class="col-xs-3"
    />
    <q-input v-model="phrase" float-label="Фраза для поиска" placeholder="фраза для поиска" class="col-xs-6"/>
    </div>
    <br>
    <q-btn color="primary" @click="searchNav" icon="fa-search">
      Поиск
    </q-btn>
    <br>

    <!--div class="row sm-gutter">
      <q-infinite-scroll :handler="loadMore" :offset="10">
        <div class="item" v-for="(stroke, index) in showingData">
          {{stroke.id}} - {{stroke.title}}
        </div>
        <q-spinner-dots slot="message" :size="50" v-show="actualMaxPosition<searchResult.length"></q-spinner-dots>
      </q-infinite-scroll>
    </div-->
    <br>
      <q-collapsible
      label="Навигация подробно"
      sublabel=""
      style="margin-bottom: 25px"
      class="shadow-2"
    >
      <q-data-table
        :data="navdetail"
        :config="ndconfig"
        :columns="ndcolumns"  
      > 
    </q-data-table>
    </q-collapsible>
    <br>
      <q-data-table
        :data="respdata"
        :config="config"
        :columns="columns"  
      > 
      <template slot="col-navnom" scope="cell">
    <q-btn color="indigo-6" @click="showNav(cell)">
      <i>{{cell.data}}</i>
    </q-btn>    
  </template>
    
    </q-data-table> 
  </div>
</template>

<script>
import {
  Toast,
  QSpinnerDots,
  QInfiniteScroll,
  QList,
  QItem,
  QBtn,
  QInput,
  QCheckbox,
  QSelect,
  QDataTable,
  QCollapsible
} from 'quasar'
import axios from 'axios'

export default {
  name: 'NavSearch',
  components: {
    QSpinnerDots,
    QInfiniteScroll,
    QList,
    QItem,
    QBtn,
    QInput,
    QCheckbox,
    QSelect,
    QDataTable,
    QCollapsible
  },
  data () {
    return {
      fieldName: [
        {
          label: 'Условие', value: 'COND'},
        {label: 'Действие',
          value: 'ACTION'},
        {label: 'Операция',
          value: 'OP'},
        {label: 'Комментарий',
          value: 'COMM'}
      ],
      fnSelect: '',
      phrase: '',
      searchResult: [],
      actualMaxPosition: 10,
      srvSelected: [],
      config: {
        // [REQUIRED] Set the row height
        rowHeight: '50px',
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        columnPicker: true
      },
      columns: [
        { label: 'Server name', field: 'serverName', width: '200px', sort: true },
        { label: 'Name', field: 'name', width: '100px', sort: true },
        { label: 'Nav nom', field: 'navnom', width: '200px', sort: true },
        { label: 'Nav str', field: 'navstr', width: '100px', sort: true },
        { label: 'ACTION', field: 'action', width: '100px', sort: true },
        { label: 'COND', field: 'cond', width: '200px', sort: true },
        { label: 'OP', field: 'op', width: '500px', sort: true },
        { label: 'COMM', field: 'comm', width: '300px', sort: true }
      ],
      ndconfig: {
        rowHeight: '30px',
        pagination: {
          rowsPerPage: 5,
          options: [1, 3, 5, 10, 15, 30, 50, 500]
        },
        columnPicker: true,
        leftStickyColumns: 2,
        responsive: true
      },
      ndcolumns: [
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
    selection: function (row) {

    }
  },
  computed: {
    navdetail () {
      return this.$store.state.navigation.result
    },
    showingData () {
      return this.searchResult.slice(0, this.actualMaxPosition)
    },
    srvOptions () {
      return this.$store.state.serversList.map(server => {
        return {label: server.name, value: server.id}
      })
    },
    respdata () {
      return this.$store.state.navSearchResult
    }

  },
  methods: {
    showNav (row) {
      console.log('!!!!!!!!!', row)
      let infoQuery = `select t1.mdate "lastmod", (select max(rownum) from f_${row.row.name} t2 where t2.NAVNOM=t1.NAVNOM) "rowsumm" from f_${row.row.name} t1 where t1.navnom='${row.row.navnom}' and t1.mdate=(select max(t3.mdate) from f_${row.row.name} t3 where t3.NAVNOM=t1.NAVNOM)`
      let strSQL = `select * from f_${row.row.name} where NAVNOM=${row.row.navnom}`
      this.$store.dispatch('getNav', {navName: `${row.row.name}_${row.row.navnom}`, query: strSQL, infoquery: infoQuery, servers: [row.row.serverName]})
    },
    loadMore (index, done) {
      setTimeout(() => {
        this.actualMaxPosition += 9
        done()
      }, 1000)
    },
    searchNav (e) {
      this.$store.dispatch('navSearch', {servers: this.srvSelected, field: this.fnSelect, phrase: this.phrase})
      /* axios.get('https://jsonplaceholder.typicode.com/albums')
        .then(res => {
          if (res.status === 200) {
            this.actualMaxPosition = 10
            this.searchResult = res.data
          }
        })
        .catch(err => {
          Toast.create.negative('Ошибка загрузки')
          console.log(err)
        })
        */
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
</style>
