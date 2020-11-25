<template>
  <q-layout view = "lHh LpR fFf">
    <q-header elevated id = 'layoutHeader'>
      <q-toolbar>
        <q-btn
          flat
          dense
          icon="menu"
          aria-label="Menu"
          class="navigationButtonTop"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title id="toolbarTitle">
          Loading...
        </q-toolbar-title>

        <!--div>Quasar v{{ $q.version }}</div-->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model = "leftDrawerOpen"
      show-if-above
      bordered
      content-class = "bg-grey-1"
      id = 'leftDrawer'
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Navigation
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

export default {
  name: 'Layout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Login page',
          // title: 'Catalog of games',
          // caption: 'All games',
          caption: 'Under development',
          icon: 'view_module',
          link: '/#/'
        },
        {
          title: 'Spot the logo',
          caption: 'Create a new game',
          icon: 'add_box',
          link: '/#/creategame/spotlogo'
        },
        {
          title: 'Spot the distortion',
          caption: 'Create a new game',
          icon: 'add_box',
          link: '/#/creategame/spotdistortion'
        },
        {
          title: 'Stop it',
          caption: 'Create a new game',
          icon: 'add_box',
          link: '/#/creategame/stopit'
        },
        {
          title: 'Time it',
          caption: 'Create a new game',
          icon: 'add_box',
          link: '/#/creategame/timeit'
        },
        {
          title: 'Spot logo still image',
          caption: 'Create a new game',
          icon: 'add_box',
          link: '/#/creategame/spotlogostill'
        },
        {
          title: 'Spot distortion still image',
          caption: 'Create a new game',
          icon: 'add_box',
          link: '/#/creategame/spotdistortionstill'
        },
        /*
        {
          title: 'Player mode',
          icon: 'games',
          link: '/#/playermode'
        },
        */
        {
          title: 'Admin panel',
          icon: 'settings',
          link: '/#/adminpage'
        }
        /*
        {
          title: 'Sample',
          caption: 'Under development',
          icon: 'waves',
          link: '/#/qsample'
        }
        */
      ]
    }
  }
}
</script>
