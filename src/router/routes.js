const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      // { path: '/', name: 'catalogpage', component: () => import('pages/catalog.vue') },
      { path: '/', name: 'askpasspage', component: () => import('pages/passPage.vue') }, // to be removed
      { path: '/games/:gameId', name: 'gamepage', component: () => import('pages/baseGame.vue') },
      { path: '/creategame/:gameType', name: 'creategamepage', component: () => import('pages/baseGame.vue') }, // to be removed
      { path: '/creategame/:gameType/:password', name: 'creategamepasspage', component: () => import('pages/baseGame.vue') },
      // { path: '/playermode', name: 'playermodepage', component: () => import('pages/baseGame.vue') },
      { path: '/adminpage', name: 'adminpage', component: () => import('pages/adminpage.vue') }, // to be removed
      { path: '/adminpage/:password', name: 'adminpasspage', component: () => import('pages/adminpage.vue') }
      // { path: '/qsample', component: () => import('pages/qsample.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*', name: 'notfoundpage', component: () => import('pages/Error404.vue')
  }
]
export default routes
