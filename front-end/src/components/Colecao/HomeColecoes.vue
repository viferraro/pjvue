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
                    Criar nova coleção
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
                    <v-card class="mx-auto" max-width="500" elevation="15" :style="{ backgroundColor: red }">
                      <v-list-item three-line>
                        <v-list-item-content>
                          <v-row>
                            <v-col cols="10" justify="space-between">
                              <v-list-item-title class="headline mb-1" :style="{ color: black }">
                                {{ colecao.titulo }}
                              </v-list-item-title>
                            </v-col>
                          </v-row>

                          <v-list v-for="itemLista in 5" :key="itemLista"
                            :style="{ backgroundColor: green }">
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title :style="{ color: yellow }">Lista {{ itemLista }}
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
                Nenhuma colecao encontrada.
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

    atualizaColecoes: function () {
      this.colecoes = [];
      this.loading = true;
      axios.get(this.httpOptions.baseURL + '/colecoes', this.httpOptions)
        .then(response => {
          this.loading = false;
          this.colecoes = response.data.colecoes;
        })
        .catch(error => {
          this.loading = false;
          this.error = error;
        })
    },

    novaColecao: function () {
      this.$router.replace("/colecoes/novo")
    }
  },

  mounted() {
    console.log(this.$root.credentials);
    this.atualizaColecoes();
  }
}
</script>