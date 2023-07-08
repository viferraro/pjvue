<template>
  <v-container>
    <v-main class="bg-grey-lighten-3bg">
      <v-container>

        <v-row>
          <v-col cols="3">
            <v-sheet :rounded=true>
              <v-list :rounded=true>
                <v-list-item link @click="atualizaColecoes">
                  <v-list-item-title>
                    Atualizar coleções
                  </v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4" @click="novaColecao">
                  <v-list-item-title>
                    Criar nova coleções
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-row justify="center">
            <loading :active="loading" :is-full-page="true" />
          </v-row>
          <v-row v-if="colecoes.length > 0" justify="space-around">
            <v-col v-for="colecao in colecoes" :key="colecao.id" cols="4">
              <v-sheet class="mx-auto" max-width="344" tile>
                <v-row class="fill-height" align="center" justify="center">
                  <v-col cols="12">
                    <v-card class="mx-auto" max-width="500" elevation="15" :style="{ backgroundColor: colecao.corFundo }">
                      <v-list-item three-line>
                        <v-list-item-content>
                          <v-row>
                            <v-col cols="10" justify="space-between">
                              <v-list-item-title class="headline mb-1" :style="{ color: colecao.corTexto }">
                                {{ colecao.titulo }}
                              </v-list-item-title>
                            </v-col>

                          </v-row>

                          <v-list v-for="itemQuadro in 5" :key="itemQuadro"
                                  :style="{ backgroundColor: corAjustada(colecao.corFundo) }">
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title :style="{ color: colecao.corTexto }">Quadro {{ itemQuadro }}
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                          <v-row>
                            <v-col cols="8" justify="space-between">
                              <v-btn type="submit" class="primary" elevation="5" small @click="editaColecao">Editar</v-btn>
                            </v-col>
                          </v-row>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>

          <v-row v-else justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-alert :value="true" type="info" elevation="2" icon="mdi-information">
                Nenhuma coleção encontrada.
              </v-alert>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-main>
  </v-container>
</template>

<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';

export default {
  data() {
    return {
      colecoes: [],

      lightenAmount: 0.3,
      error: "",
      loading: false,

      httpOptions: {
        baseURL: this.$root.config.urlBack,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.$root.credentials.token
        }
      },
    }
  },

  components: {
    Loading
  },

  methods: {
    corAjustada(color) {
      var amount = this.lightenAmount;
      // Remove o caractere '#' da cor hexadecimal
      const hexColor = color.replace('#', '');

      // Converte a cor hexadecimal para os valores de RGB
      const red = parseInt(hexColor.substr(0, 2), 16);
      const green = parseInt(hexColor.substr(2, 2), 16);
      const blue = parseInt(hexColor.substr(4, 2), 16);

      // Calcula a cor clareada com base no valor fornecido
      const lightenedRed = Math.round(red + (255 - red) * amount);
      const lightenedGreen = Math.round(green + (255 - green) * amount);
      const lightenedBlue = Math.round(blue + (255 - blue) * amount);

      // Converte os valores de RGB de volta para a cor hexadecimal
      const lightenedHex = '#' +
          lightenedRed.toString(16).padStart(2, '0') +
          lightenedGreen.toString(16).padStart(2, '0') +
          lightenedBlue.toString(16).padStart(2, '0');

      // Retorna a cor clareada no formato hexadecimal
      return lightenedHex;
    },

    recuperaColecao: function () {
      this.colecoes = null;
      this.loading = true;
      axios.get(this.httpOptions.baseURL + '/colecoes', this.httpOptions)
          .then(response => {
            var colecoes = response.data.colecoes;

            var requests = colecoes.map(colecao =>
                axios.get(this.httpOptions.baseURL + '/listas/?idQuadro=' + colecao._id)
                    .then(response => {
                      colecao.quadros = response.data.items;
                    })
            );

            return Promise.all(requests)
                .then(() => {
                  this.colecoes = colecoes;
                  this.loading = false;
                });
          })
          .catch(error => {
            console.error('Erro ao recuperar as colecoes:', error);
          });
    },

    recuperaUsuarios: function () {
      axios.get(this.httpOptions.baseURL + '/usuarios')
          .then(response => {
            var dados = response.data.items;
            this.usuarios = dados.filter(usuario => usuario.email != this.$root.credentials.email);
          })
          .catch(error => {
            console.error('Erro ao recuperar os usuários:', error);
          });
    },

    novaColecao: function () {
      this.$router.replace("/colecoes/novo")
    }
  },

  mounted() {
    console.log(this.$root.credentials);
    this.recuperaColecao();
    this.recuperaUsuarios();
  }
}
</script>

<style>
/* Inserindo um estilo que tenha posição absoluta e o item aparece de cima pra baixo */
.v-btn--reveal {
  transition: all .3s cubic-bezier(.55, 0, .1, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
