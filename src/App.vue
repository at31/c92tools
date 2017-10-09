<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <q-toolbar slot="header" class="glossy">
      <q-btn
        flat
        @click="$refs.layout.toggleLeft()"
      >
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        CE2-TOOLS
        <div slot="subtitle"></div>
      </q-toolbar-title>
    </q-toolbar>

    <div slot="left">
      <!--
        Use <q-side-link> component
        instead of <q-item> for
        internal vue-router navigation
      -->

      <q-list no-border link inset-delimiter>
        <q-list-header>CE2-DEV-TOOLS</q-list-header>
        <q-item @click="">
          <q-item-side icon="fa-server" />
          <q-side-link to="/">
            <q-item-main label="Список серверов" sublabel="список серверов для получения информации" />  
          </q-side-link>          
        </q-item>
        <q-item @click="">
          <q-item-side icon="fa-search" />
          <q-side-link to="/nav-search">
            <q-item-main label="Поиск" sublabel="поиск в навигациях" />  
          </q-side-link>          
        </q-item>
        <q-item @click="">
          <q-item-side icon="fa-database" />
          <q-side-link to="/nav-save">
            <q-item-main label="Сохранение навигаций" sublabel="сохранение выбранных навигаций в локальной DB" />  
          </q-side-link>          
        </q-item>
        <q-item @click="">
          <q-item-side icon="fa-cube" />
          <q-side-link to="/nav-diff">
            <q-item-main label="Сравнение навигаций" sublabel="сравнение навигаций (DB, local)" />  
          </q-side-link>          
        </q-item>
      </q-list>
    </div>
          
    <div class="layout-padding" id="q-app">
    <router-view />
    </div>
  </q-layout>  
</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QSideLink
} from 'quasar'

export default {
  name: 'APP',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QSideLink
  },
  data () {
    return {

    }
  }
}
</script>

<style></style>
