import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Router from 'vue-router'
import ControladorCRUD from './assets/controlador-crud.js'

/* Páginas de login, Registro e homepage */
import Login from './components/Usuario/FormLogin.vue'
import Registro from './components/Usuario/FormRegistro.vue'
import Home from './components/HomePage.vue'
import esqueci from './components/Usuario/FormRecuperaSenha.vue'
import novaSenha from './components/Usuario/FormNovaSenha.vue'
import alteraRegistro from './components/Usuario/FormAlteraRegistro.vue'


/* Páginas de Quadros */
import Quadro from './components/Quadros/HomeQuadros.vue'
import QuadroForm from './components/Quadros/FormQuadros.vue'
import editar from './components/Quadros/FormEditaQuadros.vue'
import QuadroDetalhe from './components/Quadros/DetalhamentoQuadro.vue'
import CompartilhaQuadro from './components/Quadros/CompartilhaQuadro.vue'

/* Páginas de Colecoes */
import Colecao from './components/Colecao/HomeColecoes.vue'
import ColecaoForm from './components/Colecao/FormColecoes.vue'

/* Controlador do cadastro de cards */
var controladorCadastroCards = ControladorCRUD.criaControladorCRUD();

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
      path: '/Registro/alterar',
      name: 'alteraRegistro',
      component: alteraRegistro
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
      path: '/quadros/detalhar/:id',
      name: 'quadroDetalhamento',
      component: QuadroDetalhe,
      props: { 'controlador': controladorCadastroCards }
    },
    {
      path: '/quadros/compartilhar',
      name: 'compartilhaQuadro',
      component: CompartilhaQuadro,
    },
    {
      path: '/colecoes/novo',
      name: 'colecaoForm',
      component: ColecaoForm
    },
    {
      path: '/colecoes',
      name: 'colecao',
      component: Colecao
    },

    {
      path: '/quadros/editar/:id',
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