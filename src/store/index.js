import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {Toast, Loading, QSpinnerCircles} from 'quasar'

Vue.use(Vuex)
const spinner = {
  spinner: QSpinnerCircles,
  spinnerColor: 'deep-purple-9',
  spinnerSize: 140,
  message: '',
  messageColor: 'black'
}
const REST_SERVER_ADDRESS1 = 'http://192.168.5.142:8080/c92t/res/wtch/'
const REST_SERVER_ADDRESS = 'http://127.0.0.1:8080/c92t/res/wtch/'

const state = {
  serversList: [],
  servers: [],
  navSearchResult: [],
  diffResult: [[], []],
  navigation: {result: []},
  localNavigation: {result: []},
  allNavs: [{ name: 'nav', server: 'server name', id: 'some-IDs', navnom: 'navnom' }],
  navigationList: []
}

const actions = {
  getNavigationList (context, serverName) {
    Loading.show(spinner)
    axios.post(REST_SERVER_ADDRESS + 'navigation-list', serverName)
      .then(resp => {
        if (resp.status === 200) {
          Loading.hide()
          Toast.create.positive('загрузка закончена')
          context.commit('SET_NAVIGATION_LIST', resp.data)
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка обращения к серверу')
        console.log(err)
      })
  },
  getLocalNav (context, id) {
    Loading.show(spinner)
    axios.get(REST_SERVER_ADDRESS + 'getlocalnav/' + id)
      .then(resp => {
        if (resp.status === 200) {
          Loading.hide()
          Toast.create.positive('загрузка закончена')
          context.commit('SET_LOCAL_NAVIGATION', resp.data)
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка обращения к серверу')
        console.log(err)
      })
  },
  getAllNavs (context) {
    Loading.show(spinner)
    axios.get(REST_SERVER_ADDRESS + 'getallnavs')
      .then(resp => {
        if (resp.status === 200) {
          Loading.hide()
          Toast.create.positive('загрузка закончена')
          context.commit('SET_ALL_NAVIGATION', resp.data)
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка обращения к серверу')
        console.log(err)
      })
  },
  getNav (context, nav) {
    console.log('nav', nav)
    Loading.show(spinner)
    axios.post(REST_SERVER_ADDRESS + 'getnav', nav)
      .then(resp => {
        if (resp.status === 200) {
          Loading.hide()
          Toast.create.positive('загрузка закончена')
          context.commit('SET_NAVIGATION', resp.data)
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка обращения к серверу')
        console.log(err)
      })
  },
  diffNav (context, nav) {
    console.log('nav', nav)
    Loading.show(spinner)
    axios.post(REST_SERVER_ADDRESS + 'navdiff', nav)
      .then(resp => {
        if (resp.status === 200) {
          Loading.hide()
          Toast.create.positive('сравненние закончено')
          context.commit('SET_DIFF_RESULT', resp.data)
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка обращения к серверу')
        console.log(err)
      })
  },
  saveNavLocalDB (context, nav) {
    Loading.show(spinner)
    axios.post(REST_SERVER_ADDRESS + 'navsave', nav)
      .then(resp => {
        if (resp.status === 200) {
          Loading.hide()
          Toast.create.positive('успешно сохранено в локальной базе данных')
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка обновления списка серверов')
        console.log(err)
      })
  },
  navSearch (context, sObj) {
    Loading.show(spinner)
    axios.post(REST_SERVER_ADDRESS + 'allsearch', sObj)
      .then(resp => {
        Loading.hide()
        if (resp.status === 200) {
          context.commit('SEARCH_RESULT', resp.data)
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка смервера при поиске')
        console.log(err)
      })
  },
  updateServers (context) {
    Loading.show(spinner)
    var newarr = context.state.servers.filter(el => {
      return context.state.serversList.findIndex(_el => _el.id === el.id) < 0
    })
    var delarr = context.state.serversList.filter(el => {
      return context.state.servers.findIndex(_el => _el.id === el.id) < 0
    })
    var updarr = context.state.servers.filter(el => {
      return context.state.serversList.findIndex(_el => _el.id === el.id) > -1
    })
    console.log('arr', newarr, delarr, updarr)
    axios.post(REST_SERVER_ADDRESS + 'uservers', {newarr: newarr, delarr: delarr, updarr: updarr})
      .then(resp => {
        if (resp.status === 200) {
          Loading.hide()
          context.dispatch('loadAllServers')
        }
      })
      .catch(err => {
        Loading.hide()
        Toast.create.negative('ошибка обновления списка серверов')
        console.log(err)
      })
  },
  loadAllServers (context, srvrs) {
    if (context.state.serversList.length === 0) {
      Loading.show(spinner)
      axios.get(REST_SERVER_ADDRESS + 'serverslist')
        .then(resp => {
          Loading.hide()
          if (resp.status === 200) {
            context.commit('SERVERS_LOADED', resp.data)
          }
        })
        .catch(err => {
          Loading.hide()
          Toast.create.negative('ошибка загрузки списка серверов')
          console.log(err)
        })
    }
  }
}

const mutations = {
  SET_NAVIGATION_LIST (state, data) {
    state.navigationList = data
  },
  SET_LOCAL_NAVIGATION (state, data) {
    state.localNavigation = data
  },
  SET_ALL_NAVIGATION (state, data) {
    state.allNavs = data
  },
  SET_NAVIGATION (state, data) {
    state.navigation = data
  },
  SET_DIFF_RESULT (state, data) {
    state.diffResult = data
  },
  SEARCH_RESULT (state, data) {
    state.navSearchResult = data
  },
  ADD_SERVER (state, srv) {
    state.servers.push(srv)
  },
  REMOVE_SERVER (starte, id) {
    state.servers.splice(state.servers.findIndex(_s => {
      return _s.id === id
    }), 1)
  },
  SERVERS_LOADED (state, data) {
    state.serversList = data.map(srv => {
      return {
        id: srv.__id,
        name: srv.name,
        address: srv.address,
        pass: srv.pass,
        login: srv.login,
        desc: srv.desc
      }
    })
    state.servers = state.serversList.map(srv => srv)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
  }
})
