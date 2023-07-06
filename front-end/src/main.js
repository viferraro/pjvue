import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Router from 'vue-router'
// import '../src/assets/.treco.png'

/* Páginas de login, Registro e homepage */
import Login from './components/Usuario/FormLogin.vue'
import Registro from './components/Usuario/FormRegistro.vue'
import Home from './components/HomePage.vue'
import esqueci from './components/Usuario/FormRecuperaSenha.vue'
import novaSenha from './components/Usuario/FormNovaSenha.vue'


/* Páginas de Quadros */
import Quadro from './components/Quadros/HomeQuadros.vue'
import QuadroForm from './components/Quadros/FormQuadros.vue'
import editar from './components/Quadros/FormEditaQuadros.vue'

/* Páginas de Colecoes */
import Colecao from './components/Colecao/HomeColecoes.vue'
import ColecaoForm from './components/Colecao/FormColecoes.vue'

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
      path: '/esqueci',
      name: 'esqueci',
      component: esqueci
    },
    {
      path: '/registro',
      name: 'registro',
      component: Registro
    },
    {
      path: '/quadros',
      name: 'quadro',
      component: Quadro
    },
    {
      path: '/quadros/novo',
      name: 'quadroForm',
      component: QuadroForm
    },
    {
      path: '/colecoes/novo',
      name: 'colecaoForm',
      component: ColecaoForm
    },
    {
      path: '/colecoes/',
      name: 'colecao',
      component: Colecao
    },

    {
      path: '/editar',
      name: 'editar',
      component: editar
    },

    {
      path: '/login/reset',
      name: 'novaSenha',
      component: novaSenha
    },

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