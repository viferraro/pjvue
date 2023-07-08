<template>
  <v-app>
    <v-navigation-drawer v-if="$root.credentials" app v-model="drawer">
        <v-list nav>
            <v-list-item-group active-class="deep-green--text text--accent-4">
                <v-list-item>
                    <v-list-item-title @click="homeQuadros">Quadros</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="homeColecao">Coleção</v-list-item-title>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#BED9D9">
      <v-app-bar-nav-icon @click.stop="toggleDrawer" v-if="$root.credentials"></v-app-bar-nav-icon>
      <v-container class="d-flex align-center ">
        <v-img max-width="15%" src="./assets/Imagens/logo-nome.png" class="my-3" contain></v-img>
        <v-avatar class="me-10 ms-4" color="grey-darken-1" size="32"></v-avatar>

        <v-spacer></v-spacer>

        <span v-if="$root.credentials" @click="alteraRegistro">
          Olá, {{ $root.credentials.nome }}.
          <router-link :to="{ name: 'change-password' }" replace>
            <v-btn icon><v-icon>mdi-lock-reset</v-icon></v-btn>
          </router-link>
          <v-btn icon @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
        </span>

      </v-container>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app>
      @TaskVerse @2023
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    drawer: false
  }),

  methods: {
    toggleDrawer: function () {
      this.drawer = !this.drawer;
    },

    logout: function () {
      this.$root.credentials = null;
      this.$router.replace('/');
    },

    homeQuadros: function() {
      this.$router.replace('/quadros/');
    },

    homeColecao: function() {
      this.$router.replace('/colecoes/');
    },
  },
};
</script>

<style>
p.error {
  color: white !important;
}

.v-data-table__wrapper {
  border-top: 1px solid #ccc;
}
</style>