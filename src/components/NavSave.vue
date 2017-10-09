<template>
  <div>
    <h3>Сохранение навигаций в локальной DB</h3>
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
    <q-btn color="primary" @click="showNav" icon="fa-eye">
      Показать навигацию
    </q-btn>
    <q-btn color="primary" @click="saveNav" icon="fa-save">
      Сохранить навигацию
    </q-btn>
    <br>

    <div class="row sm-gutter">
      <!--q-infinite-scroll :handler="loadMore" :offset="10">
        <div class="item" v-for="(stroke, index) in showingData">
          {{stroke.id}} - {{stroke.title}}
        </div>
        <q-spinner-dots slot="message" :size="50" v-show="actualMaxPosition<searchResult.length"></q-spinner-dots>
      </q-infinite-scroll-->
    </div>
    
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QBtn,
  QInput,
  QCheckbox,
  QSelect
} from 'quasar'

export default {
  name: 'Hello',
  components: {
    QList,
    QItem,
    QBtn,
    QInput,
    QCheckbox,
    QSelect
  },
  data () {
    return {
      selection: [],
      navTable: '',
      navName: '',
      srvSelected: []

    }
  },
  watch: {
    selection: function (n) {
      console.log(n)
    }
  },
  computed: {
    servers () {
      return this.$store.state.serversList
    },
    srvOptions () {
      return this.$store.state.serversList.map(server => {
        return {label: server.name, value: server.id}
      })
    }
  },
  methods: {
    showNav: function (e) {

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

  },
  beforeDestroy () {

  }
}
</script>

<style lang="stylus">
.p10
  margin-left: 10px
</style>
