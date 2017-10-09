<template>
  <div>
    <h3>Список серверов для получения информации</h3>
    <div class="row sm-gutter" v-for="server in servers">
      <q-checkbox :id="server.id" v-model="selection" :val="server.id" label="" class="col-xs-1"/>
      <q-input v-model="server.name" float-label="Название сервера" placeholder="название сервера" class="col-xs-3 "/>
      <q-input v-model="server.address" float-label="адрес сервера" placeholder="@192.168.1.1" class="col-xs-3 "/>
      <q-input v-model="server.pass" float-label="Пароль сервера" type="password" placeholder="пароль сервера" class="col-xs-2 "/>
      <q-input v-model="server.desc" float-label="Описание сервера"  placeholder="описание сервера" class="col-xs-3 "/>
    </div>
    <br>
    <q-btn color="primary" @click="addNew">
      Добавить сервер
    </q-btn>
    <q-btn color="red" @click="delSelected">
      Удалить сервер
    </q-btn>
    <q-btn color="green" @click="saveChng">
      Сохранить изменения
    </q-btn>
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QBtn,
  QInput,
  QCheckbox
} from 'quasar'

export default {
  name: 'Servers',
  components: {
    QList,
    QItem,
    QBtn,
    QInput,
    QCheckbox
  },
  data () {
    return {
      selection: []
    }
  },
  watch: {
    selection: function (n) {
      console.log(n)
    }
  },
  computed: {
    servers () {
      return this.$store.state.servers
    }
  },
  methods: {
    saveChng () {
      this.$store.dispatch('updateServers', this.servers)
    },
    addNew (e) {
      this.$store.commit('ADD_SERVER', {id: this.servers.length + 111, name: '', address: '', pass: '', desc: '', login: ''})
    },
    delSelected (e) {
      this.selection.forEach(s => {
        this.$store.commit('REMOVE_SERVER', s)
      })
      this.selection = []
    }
  },
  mounted () {
    this.$store.dispatch('loadAllServers')
  },
  beforeDestroy () {

  }
}
</script>

<style lang="stylus">
.p10
  margin-left: 10px
</style>
