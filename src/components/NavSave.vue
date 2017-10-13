<template>
  <div>
<div class="row sm-gutter">
  <div class="col-3">
    <h5>Списорк доступных навигаций</h5>
    <q-select
        v-model="srvNavList"
        float-label="Сервер для поиска"
        chips
        :options="srvOptions"/>
    <q-btn color="primary" @click="loadNavigationList" icon="fa-list-ol">
          Загрузить список навигаций
    </q-btn> 
    <br>
    <br>
    <q-list separator>
      <q-collapsible icon="fa-folder" :label="table.navTable" v-for="table in navigationList" :key="navTable">
        <q-item link v-for="nav in table.nlist" :key="nav.name" inset-separator @click.prevent="showNav({name:table.navTable, navnom:nav.name})">
          <q-item-side>
            <q-checkbox v-model="selection" :val="nav.name" />
          </q-item-side>
          <q-item-main >
            <q-item-tile label>{{table.navTable +"." + nav.name}}</q-item-tile>
            <q-item-tile sublabel> {{nav.navnom}}</q-item-tile>
            <!--q-item-tile sublabel> {{nav.navstr}}</q-item-tile-->
          </q-item-main>  
        </q-item>
      </q-collapsible>
    </q-list>
    <!--ul v-for="table in navigationList" :key="navTable">
      <h6>{{table.navTable}}</h6>
      <ul v-for="nav in table.nlist" :key="nav.name">
        <li>
          <q-checkbox v-model="selection" :val="nav.name" />
          <a href="#" @click.prevent="showNav({name:table.navTable, navnom:nav.name})">{{table.navTable +"." + nav.name}}</a><br>
          <span>{{nav.navnom}}</span>
        </li>
      </ul>
    </ul-->  
    
  </div>
  <div class="col-6">
    <q-card >
      <q-card-title>
        Сохранение навигаций в локальной DB
      </q-card-title>
      <q-card-separator />
      <q-card-main>     
        <q-select
        v-model="srvSelected"
        float-label="Сервер для поиска"
        multiple
        chips
        :options="srvOptions" class="col-xs-3"
        />

        <q-input v-model="navTable" float-label="Справочник (SYS, USR etc.)" placeholder="" class="col-xs-3"/>
        <q-input v-model="navName" float-label="Номер навигации" placeholder="" class="col-xs-3"/>
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <!--q-btn color="primary" @click="showNav" icon="fa-eye">
          Показать навигацию
        </q-btn-->
        <q-btn color="primary" @click="saveNav" icon="fa-save">
          Сохранить навигацию
        </q-btn>    
      </q-card-actions>
    </q-card>

  </div>
  <div class="col-3 ">
    <h5>Список сохраненных навигаций</h5>
    <ul v-for="nav in allNavs">
      <li><a href="#" @click.prevent="showLocalNav(nav.__id)">{{nav.name}}</a></li>
    </ul>
  </div>
</div>
  

    
    <q-modal ref="dbNavModal" :content-css="{padding: '50px', maxWidth: '90vw'}">
      <q-data-table
        :data="navdetail"
        :config="ndconfig"
        :columns="ndcolumns"  
      > 
      </q-data-table>
      <q-btn color="primary" @click="$refs.dbNavModal.close()">Close</q-btn>
    </q-modal>
    <q-modal ref="localNavModal" :content-css="{padding: '50px', maxWidth: '90vw'}">
      <q-data-table
        :data="localNavigation"
        :config="ndconfig"
        :columns="ndcolumns"  
      > 
      </q-data-table>
      <q-btn color="primary" @click="$refs.localNavModal.close()">Close</q-btn>
    </q-modal>
  </div>
</template>

<script>
import {
  QCollapsible,
  QModal,
  QDataTable,
  QCard,
  QCardTitle,
  QCardActions,
  QCardSeparator,
  QCardMain,
  QList,
  QListHeader,
  QItem,
  QItemSeparator,
  QItemSide,
  QItemMain,
  QItemTile,
  QBtn,
  QInput,
  QCheckbox,
  QSelect
} from 'quasar'

export default {
  name: 'Hello',
  components: {
    QCollapsible,
    QModal,
    QDataTable,
    QCard,
    QCardTitle,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QList,
    QListHeader,
    QItem,
    QItemSeparator,
    QItemSide,
    QItemMain,
    QItemTile,
    QBtn,
    QInput,
    QCheckbox,
    QSelect
  },
  data () {
    return {
      ifolder: 'fa-folder',
      selection: [],
      navTable: '',
      navName: '',
      srvSelected: [],
      srvNavList: '',
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
    selection: function (n) {
      console.log(n)
    },
    navdetail: function (n) {
      console.log(n)
      this.$refs.dbNavModal.open()
    },
    localNavigation: function () {
      this.$refs.localNavModal.open()
    }
  },
  computed: {
    navigationList () {
      return this.$store.state.navigationList
    },
    navdetail () {
      return this.$store.state.navigation.result
    },
    servers () {
      return this.$store.state.serversList
    },
    srvOptions () {
      return this.$store.state.serversList.map(server => {
        return {label: server.name, value: server.id}
      })
    },
    allNavs () {
      return this.$store.state.allNavs
    },
    localNavigation () {
      return this.$store.state.localNavigation.result
    }
  },
  methods: {
    cOpen (e) {
      console.log(e.currentTarget)
      this.ifolder = 'fa-folder-open'
    },
    cClose () {
      this.ifolder = 'fa-folder'
    },
    loadNavigationList (e) {
      // console.log(this.srvNavList)
      this.$store.dispatch('getNavigationList', {servers: [this.srvNavList]})
    },
    showLocalNav (id) {
      this.$store.dispatch('getLocalNav', id)
    },
    showNav (row) {
      let a1 = this.$store.state.serversList.filter(srv => { return srv.id === this.srvNavList })
      let _server = a1.map(srv => srv.name)
      let infoQuery = `select t1.mdate "lastmod", (select max(rownum) from f_${row.name} t2 where t2.NAVNOM=t1.NAVNOM) "rowsumm" from f_${row.name} t1 where t1.navnom='${row.navnom}' and t1.mdate=(select max(t3.mdate) from f_${row.name} t3 where t3.NAVNOM=t1.NAVNOM)`
      let strSQL = `select * from f_${row.name} where NAVNOM=${row.navnom}`
      this.$store.dispatch('getNav', {navName: `${row.name}_${row.navnom}`,
        query: strSQL,
        infoquery: infoQuery,
        servers: _server})
    },
    saveNav: function (e) {
      // String query, String infoquery, String conn, String login, String pass, boolean savetofile, String filepath, String oname, String serverName
      /* let infoQuery = `select t1.mdate "lastmod", (select max(rownum) from f_nav${this.navTable} t2 where t2.NAVNOM=t1.NAVNOM) "rowsumm", (select TEXT||' '||NAME1||' '||NAME2||' ID='||NOMER from f_users u where u.NOMER=t1.MUSER) "usermod" from f_nav${this.navTable} t1 where t1.navnom='${this.navName}' and t1.mdate=(select max(t3.mdate) from f_nav${this.navTable} t3 where t3.NAVNOM=t1.NAVNOM)` */
      let infoQuery = `select t1.mdate "lastmod", (select max(rownum) from f_nav${this.navTable} t2 where t2.NAVNOM=t1.NAVNOM) "rowsumm" from f_nav${this.navTable} t1 where t1.navnom='${this.navName}' and t1.mdate=(select max(t3.mdate) from f_nav${this.navTable} t3 where t3.NAVNOM=t1.NAVNOM)`
      let strSQL = `select * from f_NAV${this.navTable} where NAVNOM=${this.navName}`
      this.$store.dispatch('saveNavLocalDB', {navName: `${this.navTable}_${this.navName}`, query: strSQL, infoquery: infoQuery, servers: this.srvSelected})
    }
  },
  mounted () {
    this.$store.dispatch('getAllNavs')
  },
  beforeDestroy () {

  },
  beforeMounted () {
    // this.$store.diaspatch('getAllNavs')
  }
}
</script>

<style lang="stylus">
.p10
  margin-left: 10px
</style>
