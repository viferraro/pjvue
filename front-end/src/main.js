import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Router from 'vue-router'
// import '../src/assets/.treco.png'

/* Páginas de login e homepage */
import Login from './components/Usuario/FormLogin.vue'
import Home from './components/HomePage.vue'

/* Páginas de Quadros */
import Quadro from './components/Quadros/FormQuadros.vue'

/* Configuracao do router */
Vue.config.productionTip = false
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
   {
     path: '/',
     name: 'home',
     component: Home
   },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/quadro',
      name: 'quadro',
      component: Quadro
    }
  ]
})

/* Configuracao do Vue JS */
new Vue({
  data: {
    credentials: null,
    config: {
      url: "http://localhost:8080",
      urlBack: "http://localhost:3000",
    }
  },

  el: '#app',
  render: h => h(App),
  vuetify,
  router
}).$mount('#app')